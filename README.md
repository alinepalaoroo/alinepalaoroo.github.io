# site-aline

Site pessoal da Aline Palaoro. Construído com Astro v7.1.3.

## Rodar local

```bash
npm install
npm run dev
```

O site abre em `http://localhost:4321/`.

## Build

```bash
npm run build
```

Gera a versão estática em `dist/`.

## Publicar um post novo

Para publicar um post no blog, crie um arquivo `.md` em `src/content/blog/` com o frontmatter abaixo e faça commit na branch `main`. O deploy acontece sozinho.

```yaml
---
titulo: Título do post
descricao: Descrição curta do post.
publicadoEm: 2026-07-27
tags: ["tag1", "tag2"]
rascunho: false
---
```

`rascunho: true` esconde o post do build até ele ficar pronto para publicar, sem precisar apagar o arquivo.

Sem `titulo`, `descricao` e `publicadoEm` no frontmatter, o build falha na validação de schema.

## Publicar um case novo

Para publicar um case, crie um arquivo `.md` em `src/content/cases/` com o frontmatter abaixo.

```yaml
---
titulo: Título do case
descricao: Descrição curta do case.
setor: Setor do cliente
periodo: Período do projeto
stack: ["Tecnologia1", "Tecnologia2"]
ordem: 1
---
```

Sem `titulo`, `descricao`, `setor`, `periodo`, `stack` e `ordem` no frontmatter, o build falha na validação de schema.

## Verificar confidencialidade

```bash
npm run verificar
```

Rode antes de commitar qualquer conteúdo novo (case ou post): o repositório é público e o material de origem é confidencial. O mesmo verificador roda no CI e bloqueia o deploy se encontrar termo proibido, então esquecer de rodar localmente apenas atrasa a publicação, não vaza nada.
