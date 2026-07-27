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

Para publicar um post no blog, crie um arquivo `.md` em `src/content/blog/` e faça commit na branch `main`. O deploy acontece sozinho.

## Verificar confidencialidade

```bash
npm run verificar
```

Rode antes de commitar qualquer conteúdo novo (case ou post): o repositório é público e o material de origem é confidencial. O mesmo verificador roda no CI e bloqueia o deploy se encontrar termo proibido, então esquecer de rodar localmente apenas atrasa a publicação — não vaza nada.
