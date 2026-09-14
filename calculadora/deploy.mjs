// Deploy do app "calculadora" para a VPS de produção.
//
// Desde 04/09/2026 a imagem é construída AQUI (Docker local, linux/amd64) e
// publicada no GHCR; a VPS só faz pull e sobe. Antes o build rodava na VPS
// (RAM em swap) e levava 10 a 12 min. Este script:
//   1. docker build da pasta calculadora/ com a tag do commit atual
//   2. docker push para ghcr.io/avilaops/cifra-calculadora (:<sha> e :latest)
//   3. na VPS: docker login no GHCR (GITHUB_TOKEN do tokens.env), pull,
//      compose up -d do serviço e /api/health com espera de até 60 s
//
// Uso: node deploy.mjs
// Requer: Docker local logado no ghcr.io (docker login ghcr.io -u avilaops)
// e a chave privada em SSH_KEY_PATH (ou o padrão abaixo).

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
const IMAGE = "ghcr.io/avilaops/cifra-calculadora";
const LOCAL_ROOT = path.resolve(import.meta.dirname); // .../calculadora

function sh(cmd, label) {
  console.log(`\n--- ${label} ---\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: LOCAL_ROOT });
}

function buildAndPush() {
  if (!fs.existsSync(SSH_KEY_PATH)) {
    throw new Error(`Chave SSH não encontrada em ${SSH_KEY_PATH}. Defina SSH_KEY_PATH.`);
  }
  const sha = execSync("git rev-parse --short HEAD", { cwd: LOCAL_ROOT }).toString().trim();
  const dirty = execSync("git status --porcelain -- .", { cwd: LOCAL_ROOT }).toString().trim();
  if (dirty) console.warn("\nAtenção: há alterações não commitadas em calculadora/. A imagem leva o que está na árvore.");
  sh(`docker build --platform linux/amd64 -t ${IMAGE}:${sha} -t ${IMAGE}:latest .`, `Build da imagem (${sha})`);
  sh(`docker push ${IMAGE}:${sha}`, "Push :sha");
  sh(`docker push ${IMAGE}:latest`, "Push :latest");
  return sha;
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
  const sha = buildAndPush();

  const conn = await connect();
  console.log("\nConectado à VPS.");

  try {
    // O token fica só na VPS (/etc/avilaops/tokens.env); o arquivo tem linhas
    // com CRLF, por isso o grep/tr em vez de "source".
    await exec(
      conn,
      `tok=$(grep -E '^GITHUB_TOKEN=' /etc/avilaops/tokens.env | cut -d= -f2- | tr -d '\\r"'); ` +
        `[ -n "$tok" ] || { echo "GITHUB_TOKEN ausente no tokens.env"; exit 1; }; ` +
        `echo "$tok" | docker login ghcr.io -u avilaops --password-stdin`,
      "Login no GHCR",
    );

    await exec(conn, `docker pull ${IMAGE}:${sha} && docker tag ${IMAGE}:${sha} ${IMAGE}:latest`, `Pull da imagem ${sha}`);

    await exec(
      conn,
      `cd "${REMOTE_DIR}" && docker compose up -d --no-build cifra-calculadora`,
      "Subindo o container",
    );

    // O Next leva alguns segundos para abrir a porta depois do "Started".
    const health = await exec(
      conn,
      `for i in $(seq 1 20); do out=$(docker exec cifra-cifra-calculadora-1 wget -qO- http://localhost:3000/api/health 2>/dev/null) && { echo "$out"; exit 0; }; sleep 3; done; echo "sem resposta em 60 s"; exit 1`,
      "Health check (até 60 s)",
    );

    await exec(conn, `docker image prune -f >/dev/null 2>&1 || true`, "Limpando imagens antigas");

    console.log(`\nDeploy concluído (${sha}). Health:`, health.trim());
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  console.error("\nDeploy falhou:", err.message || err);
  process.exitCode = 1;
});
