import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// O próprio arquivo contém os termos proibidos por extenso (para comparar),
// então ele precisa ficar de fora da varredura ou sempre acusaria a si mesmo.
const ARQUIVO_PROPRIO = fileURLToPath(import.meta.url);

const RAIZES = ['.'];
const IGNORAR = new Set(['node_modules', 'dist', '.astro', '.git', 'package-lock.json']);
const EXTENSOES = new Set(['.md', '.astro', '.ts', '.js', '.mjs', '.css', '.json', '.yml', '.yaml', '']);

// Termo proibido, em minúscula. Cada entrada tem o motivo, para o erro ser acionável.
const PROIBIDOS = [
  ['viahidroponia', 'nome do cliente'],
  ['via hidroponia', 'nome do cliente'],
  ['hidroponia', 'nome do cliente'],
  ['forgejo', 'infraestrutura interna do cliente, fora do escopo publicado'],
  ['hetzner', 'provedor de servidor do cliente'],
  ['portainer', 'ferramenta de administração interna do cliente'],
  ['wireguard', 'topologia de acesso privado do cliente'],
  ['ssh', 'possível instrução de acesso a servidor'],
  ['gho_', 'token do GitHub'],
  ['ghp_', 'token do GitHub'],
  // Prefixos de chave de API escritos por extenso. Não usar apenas 'sk-':
  // ele casa dentro da palavra 'task-' e produz falso positivo.
  ['sk-ant-', 'chave de API da Anthropic'],
  ['sk-proj-', 'chave de API da OpenAI'],
  ['-----begin', 'chave privada'],
  ['salarial', 'material privado do workspace de carreira'],
  ['clt', 'material privado do workspace de carreira'],
];

// Termos curtos que podem aparecer colados a pontuação (fim de frase, vírgula)
// em vez de sempre seguidos de espaço. Para esses, exigir fronteira de palavra
// em vez de substring simples, senão "SSH." ou "ssh," passam batidos.
const FRONTEIRA_DE_PALAVRA = new Set(['ssh']);

function contemTermo(alvo, termo) {
  if (FRONTEIRA_DE_PALAVRA.has(termo)) {
    return new RegExp(`\\b${termo}\\b`).test(alvo);
  }
  return alvo.includes(termo);
}

function arquivos(caminho) {
  const info = statSync(caminho);
  if (info.isFile()) return [caminho];
  return readdirSync(caminho).flatMap((nome) =>
    IGNORAR.has(nome) ? [] : arquivos(join(caminho, nome))
  );
}

const achados = [];
for (const raiz of RAIZES) {
  for (const arquivo of arquivos(raiz)) {
    if (resolve(arquivo) === ARQUIVO_PROPRIO) continue;
    if (!EXTENSOES.has(extname(arquivo))) continue;
    const linhas = readFileSync(arquivo, 'utf8').split('\n');
    linhas.forEach((linha, i) => {
      const alvo = linha.toLowerCase();
      for (const [termo, motivo] of PROIBIDOS) {
        if (contemTermo(alvo, termo)) {
          achados.push(`${arquivo}:${i + 1}  "${termo}"  (${motivo})`);
        }
      }
    });
  }
}

if (achados.length > 0) {
  console.error('Termo proibido encontrado:\n');
  achados.forEach((a) => console.error('  ' + a));
  console.error('\nRemova ou reescreva antes de commitar.');
  process.exit(1);
}
console.log('OK: nenhum termo proibido encontrado.');
