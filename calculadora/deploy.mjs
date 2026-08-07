// Deploy do app "calculadora" para a VPS de produção.
//
// A pasta /opt/cifra na VPS NÃO é um repositório git (não dá pra usar
// `git pull`) — o código é sincronizado por tarball via SFTP. Este script:
//   1. empacota calculadora/ localmente (sem node_modules, .next, .env* etc.)
//   2. envia o tarball por SFTP autenticado com chave SSH
//   3. extrai na VPS (sem sobrescrever os .env de produção, que ficam fora
//      do pacote)
//   4. reconstrói e reinicia o container cifra-calculadora
//   5. confere /api/health
//
// Uso: node deploy.mjs
// Requer a chave privada em SSH_KEY_PATH (ou o padrão abaixo).

import { Client } from "ssh2";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOST = process.env.DEPLOY_HOST || "178.105.82.48";
const USERNAME = process.env.DEPLOY_USER || "root";
const SSH_KEY_PATH =
  process.env.SSH_KEY_PATH || path.join(os.homedir(), ".ssh", "hetzner_avilaops");
const REMOTE_DIR = "/opt/cifra";
const REMOTE_TARBALL = `${REMOTE_DIR}/deploy.tar.gz`;
const LOCAL_ROOT = path.resolve(import.meta.dirname); // .../calculadora
const REPO_ROOT = path.dirname(LOCAL_ROOT);
// Nome relativo (sem letra de drive) — o `tar` do Git Bash lê "C:\..." como
// "host:arquivo" (sintaxe de tar remoto) e falha. Rodamos com cwd=REPO_ROOT.
const TARBALL_NAME = `_deploy-${Date.now()}.tar.gz`;
const LOCAL_TARBALL = path.join(REPO_ROOT, TARBALL_NAME);

const TAR_EXCLUDES = [
  "node_modules",
  ".next",
  "out",
  "coverage",
  ".env",
  ".env.local",
  ".env.production",
  "*.tsbuildinfo",
  "*.log",
];

function buildTarball() {
  console.log("Empacotando calculadora/ ...");
  if (!fs.existsSync(SSH_KEY_PATH)) {
    throw new Error(`Chave SSH não encontrada em ${SSH_KEY_PATH}. Defina SSH_KEY_PATH.`);
  }
  const excludeArgs = TAR_EXCLUDES.map((p) => `--exclude=${p}`).join(" ");
  execSync(`tar czf "${TARBALL_NAME}" ${excludeArgs} calculadora`, {
    stdio: "inherit",
    cwd: REPO_ROOT,
  });
  const { size } = fs.statSync(LOCAL_TARBALL);
  console.log(`Tarball criado: ${LOCAL_TARBALL} (${(size / 1024 / 1024).toFixed(2)} MB)`);
}

function connect() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => resolve(conn))
      .on("error", reject)
      .connect({
        host: HOST,
        port: 22,
        username: USERNAME,
        privateKey: fs.readFileSync(SSH_KEY_PATH),
        readyTimeout: 30000,
      });
  });
}

function uploadTarball(conn) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      console.log(`Enviando tarball para ${REMOTE_TARBALL} ...`);
      sftp.fastPut(LOCAL_TARBALL, REMOTE_TARBALL, (err) => {
        if (err) return reject(err);
        console.log("Upload concluído.");
        resolve();
      });
    });
  });
}

function exec(conn, cmd, label) {
  return new Promise((resolve, reject) => {
    if (label) console.log(`\n--- ${label} ---`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream
        .on("close", (code) => {
          if (code !== 0) return reject(new Error(`"${label}" saiu com código ${code}`));
          resolve(out);
        })
        .on("data", (d) => {
          process.stdout.write(d);
          out += d;
        })
        .stderr.on("data", (d) => process.stderr.write(d));
    });
  });
}

async function main() {
  buildTarball();

  const conn = await connect();
  console.log("Conectado à VPS.");

  try {
    await uploadTarball(conn);

    // Extrai apenas por cima da pasta calculadora/ (o tarball já tem esse prefixo).
    // .env* ficam de fora do pacote, então nunca são tocados aqui.
    await exec(
      conn,
      `cd "${REMOTE_DIR}" && tar xzf deploy.tar.gz && rm -f deploy.tar.gz`,
      "Extraindo na VPS",
    );

    await exec(
      conn,
      `cd "${REMOTE_DIR}" && docker compose build cifra-calculadora`,
      "Build da imagem Docker",
    );

    await exec(
      conn,
      `cd "${REMOTE_DIR}" && docker compose up -d cifra-calculadora`,
      "Subindo o container",
    );

    await new Promise((r) => setTimeout(r, 3000));

    const health = await exec(
      conn,
      `docker exec cifra-cifra-calculadora-1 wget -qO- http://localhost:3000/api/health`,
      "Health check",
    );
    console.log("\nDeploy concluído. Health:", health.trim());
  } finally {
    conn.end();
    fs.rmSync(LOCAL_TARBALL, { force: true });
  }
}

main().catch((err) => {
  console.error("\nDeploy falhou:", err.message || err);
  process.exitCode = 1;
});
