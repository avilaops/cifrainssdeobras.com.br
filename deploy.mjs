// Deploy do site institucional "website" para a VPS de produção.
//
// A fonte de verdade é a VPS, não o GitHub Pages/git — /opt/cifra na VPS não
// é um repositório git. O código é sincronizado por tarball via SFTP. Este
// script:
//   1. empacota website/ localmente (sem node_modules, .next, out, .env* etc.)
//   2. envia o tarball por SFTP autenticado com chave SSH
//   3. extrai na VPS (sem sobrescrever os .env de produção, que ficam fora
//      do pacote)
//   4. reconstrói e reinicia o container cifra-website
//   5. confere se a home responde 200
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
const REMOTE_TARBALL = `${REMOTE_DIR}/deploy-website.tar.gz`;
const LOCAL_ROOT = path.resolve(import.meta.dirname); // .../website
const REPO_ROOT = path.dirname(LOCAL_ROOT);
// Nome relativo (sem letra de drive) — o `tar` do Git Bash lê "C:\..." como
// "host:arquivo" (sintaxe de tar remoto) e falha. Rodamos com cwd=REPO_ROOT.
const TARBALL_NAME = `_deploy-website-${Date.now()}.tar.gz`;
const LOCAL_TARBALL = path.join(REPO_ROOT, TARBALL_NAME);

const TAR_EXCLUDES = [
  "node_modules",
  ".next",
  "out",
  ".git",
  "coverage",
  ".env",
  ".env.local",
  ".env.production",
  "*.tsbuildinfo",
  "*.log",
];

function buildTarball() {
  console.log("Empacotando website/ ...");
  if (!fs.existsSync(SSH_KEY_PATH)) {
    throw new Error(`Chave SSH não encontrada em ${SSH_KEY_PATH}. Defina SSH_KEY_PATH.`);
  }
  const excludeArgs = TAR_EXCLUDES.map((p) => `--exclude=${p}`).join(" ");
  execSync(`tar czf "${TARBALL_NAME}" ${excludeArgs} website`, {
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

    // Extrai apenas por cima da pasta website/ (o tarball já tem esse prefixo).
    // .env* ficam de fora do pacote, então nunca são tocados aqui.
    await exec(
      conn,
      `cd "${REMOTE_DIR}" && tar xzf deploy-website.tar.gz && rm -f deploy-website.tar.gz`,
      "Extraindo na VPS",
    );

    await exec(
      conn,
      `cd "${REMOTE_DIR}" && docker compose build cifra-website`,
      "Build da imagem Docker",
    );

    await exec(
      conn,
      `cd "${REMOTE_DIR}" && docker compose up -d cifra-website`,
      "Subindo o container",
    );

    await new Promise((r) => setTimeout(r, 3000));

    const health = await exec(
      conn,
      `curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3010/`,
      "Health check (home)",
    );
    console.log("\nDeploy concluído.", health.trim());

    await pingIndexNow();
  } finally {
    conn.end();
    fs.rmSync(LOCAL_TARBALL, { force: true });
  }
}

async function pingIndexNow() {
  console.log("\nNotificando motores de busca via IndexNow API...");
  const payload = {
    host: "cifrainssdeobras.com.br",
    key: "cifra-indexnow-key-2026",
    keyLocation: "https://cifrainssdeobras.com.br/cifra-indexnow-key-2026.txt",
    urlList: [
      "https://cifrainssdeobras.com.br/",
      "https://cifrainssdeobras.com.br/sobre/",
      "https://cifrainssdeobras.com.br/servicos/",
      "https://cifrainssdeobras.com.br/servicos/inss-de-obra/",
      "https://cifrainssdeobras.com.br/servicos/cno/",
      "https://cifrainssdeobras.com.br/servicos/sero/",
      "https://cifrainssdeobras.com.br/servicos/afericao-de-obra/",
      "https://cifrainssdeobras.com.br/servicos/planejamento-tributario/",
      "https://cifrainssdeobras.com.br/parceiros/",
      "https://cifrainssdeobras.com.br/contato/",
      "https://cifrainssdeobras.com.br/procuracao-eletronica/",
    ],
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    console.log(`IndexNow submetido com status ${res.status}`);
  } catch (err) {
    console.warn("Aviso: Falha ao notificar IndexNow:", err.message || err);
  }
}

main().catch((err) => {
  console.error("\nDeploy falhou:", err.message || err);
  process.exitCode = 1;
});
