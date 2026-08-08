# Redesign Visual do Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar hierarquia visual e identidade própria ao site (`alinepalaoroo.github.io`) sem mudar
conteúdo, mantendo a stack Astro e custo zero.

**Architecture:** Restyle incremental: token de cor novo, fonte self-hosted para títulos, componentes
de card pra ofertas e listagem, tratamento de nav, e fade sutil via `IntersectionObserver` nativo (sem
biblioteca nova).

**Tech Stack:** Astro 7.1.3, CSS puro (sem framework de UI), `@fontsource/space-grotesk` (self-hosted).

## Global Constraints

- Custo zero: nenhum serviço pago, nenhuma assinatura, nenhum domínio novo.
- Sem CDN de terceiro em runtime: fonte precisa ser self-hosted (bundlada no build), nunca `<link>`
  pro Google Fonts.
- Conteúdo intocado: nenhum texto em `src/pages`, `src/content` ou `src/components` muda de
  significado.
- Todo token de cor novo precisa de par claro/escuro em `src/styles/global.css`.
- Mobile-first: verificar em 375px antes de considerar uma tarefa pronta.
- `npm run verificar` (checagem de confidencialidade) precisa continuar passando após cada task.
- `npm run build` precisa terminar sem erro nem aviso após cada task.

Referência: `docs/superpowers/specs/2026-08-08-redesign-visual-design.md`.

---

### Task 1: Fonte self-hosted para títulos

**Files:**
- Modify: `package.json` (nova dependência)
- Modify: `src/layouts/Base.astro:1-3` (import da fonte)
- Modify: `src/styles/global.css:1-10,33` (token de fonte de título, aplicado em h1/h2/h3)

**Interfaces:**
- Produces: token CSS `--fonte-titulo`, usado pelas tasks 3-6 em qualquer seletor que precise do
  peso visual de título.

- [ ] **Step 1: Instalar o pacote de fonte self-hosted**

Run: `npm install @fontsource/space-grotesk`

Isso baixa o pacote do npm (registry padrão, sem custo) e ele fica em `node_modules`. Nenhum request
externo acontece em runtime: o Astro bundla o CSS/woff2 no build.

- [ ] **Step 2: Importar o peso 500 no layout base**

Em `src/layouts/Base.astro`, no bloco de frontmatter (entre `---`), adicionar a importação junto das
outras:

```astro
---
import '@fontsource/space-grotesk/500.css';
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Rodape from '../components/Rodape.astro';
```

- [ ] **Step 3: Adicionar o token de fonte e aplicar aos títulos**

Em `src/styles/global.css`, adicionar a variável junto das outras em `:root` (linha 1-10):

```css
:root {
  --fonte: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --fonte-titulo: "Space Grotesk", var(--fonte);
  --fonte-mono: ui-monospace, "Cascadia Code", Consolas, monospace;
  --largura-leitura: 68ch;
  --cor-fundo: #fbfbf9;
  --cor-texto: #1c1c1a;
  --cor-suave: #5f5f58;
  --cor-borda: #e2e2dc;
  --cor-destaque: #1f6f5c;
}
```

E na regra existente de títulos (linha 33), trocar:

```css
h1, h2, h3 { line-height: 1.25; letter-spacing: -0.01em; }
```

por:

```css
h1, h2, h3 { font-family: var(--fonte-titulo); font-weight: 500; line-height: 1.25; letter-spacing: -0.01em; }
```

- [ ] **Step 4: Rodar o build e confirmar que a fonte foi bundlada**

Run: `npm run build`
Expected: build termina sem erro. Em seguida rodar `grep -r "Space Grotesk" dist/_astro/*.css` (ou
`Select-String` no PowerShell) e confirmar que existe pelo menos um arquivo CSS gerado contendo
`Space Grotesk` — prova de que a fonte foi embutida no bundle, não referenciada por link externo.

- [ ] **Step 5: Verificação visual rápida**

Run: `npm run dev` e abrir `http://localhost:4321/`. Confirmar visualmente que o h1 da home está
numa fonte geométrica diferente da fonte de corpo (não é mais o mesmo system-ui em tudo).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/layouts/Base.astro src/styles/global.css
git commit -m "feat: fonte self-hosted Space Grotesk para titulos"
```

---

### Task 2: Formalizar sistema de cor (token de superfície)

**Files:**
- Modify: `src/styles/global.css:1-20` (novo token `--cor-superficie`, claro e escuro)

**Interfaces:**
- Produces: token CSS `--cor-superficie`, usado pelas tasks 3 e 4 como fundo de card.

- [ ] **Step 1: Adicionar o token no tema claro**

Em `src/styles/global.css`, dentro de `:root` (mesmo bloco editado na Task 1):

```css
:root {
  --fonte: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --fonte-titulo: "Space Grotesk", var(--fonte);
  --fonte-mono: ui-monospace, "Cascadia Code", Consolas, monospace;
  --largura-leitura: 68ch;
  --cor-fundo: #fbfbf9;
  --cor-superficie: #f2f1ec;
  --cor-texto: #1c1c1a;
  --cor-suave: #5f5f58;
  --cor-borda: #e2e2dc;
  --cor-destaque: #1f6f5c;
}
```

- [ ] **Step 2: Adicionar o par escuro**

No bloco `@media (prefers-color-scheme: dark)` (linhas 12-20):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --cor-fundo: #141414;
    --cor-superficie: #1c1c1a;
    --cor-texto: #ededea;
    --cor-suave: #a3a39c;
    --cor-borda: #2c2c2a;
    --cor-destaque: #5fbfa3;
  }
}
```

- [ ] **Step 3: Rodar o build**

Run: `npm run build`
Expected: sem erro. Nenhuma mudança visual ainda nesta task (o token existe mas não é usado até a
Task 3), então não há verificação visual própria além do build passar.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: token de cor de superficie para cards"
```

---

### Task 3: Cards de oferta na home

**Files:**
- Modify: `src/pages/index.astro:65-71` (bloco `<style>`)

**Interfaces:**
- Consumes: `--cor-superficie` (Task 2), `--fonte-titulo` (Task 1, já aplicada via `h3` global).

- [ ] **Step 1: Trocar o estilo de `.oferta` de borda-esquerda para card**

Em `src/pages/index.astro`, substituir o bloco `<style>` inteiro:

```astro
<style>
  .destaque { font-size: 1.2rem; color: var(--cor-texto); }
  .oferta {
    background: var(--cor-superficie);
    border: 1px solid var(--cor-borda);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin: 1.75rem 0;
  }
  .oferta h3 { margin: 0 0 0.75rem; font-size: 1.1rem; color: var(--cor-destaque); }
  .oferta p { margin: 0 0 0.4rem; font-size: 0.97rem; }
  .oferta strong { color: var(--cor-suave); font-weight: 600; }
</style>
```

- [ ] **Step 2: Rodar o build**

Run: `npm run build`
Expected: sem erro nem aviso.

- [ ] **Step 3: Verificação visual**

Run: `npm run dev`, abrir `http://localhost:4321/`. Confirmar que as duas seções de oferta ("Diagnóstico
de operação..." e "Arquitetura e estabilização...") aparecem como blocos com fundo levemente diferente
do fundo da página e borda arredondada, com o título da oferta na cor de destaque. Alternar o tema do
sistema operacional (ou emular `prefers-color-scheme: dark` nas DevTools) e confirmar que o card
continua legível no escuro.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: cards de oferta na home"
```

---

### Task 4: Cards na listagem de cases e blog

**Files:**
- Modify: `src/components/ListaConteudo.astro:22-30` (bloco `<style>`)

**Interfaces:**
- Consumes: `--cor-superficie` (Task 2).

- [ ] **Step 1: Trocar o item de lista de "borda inferior" para card**

Em `src/components/ListaConteudo.astro`, substituir o bloco `<style>` inteiro:

```astro
<style>
  .lista { list-style: none; margin: 2rem 0 0; padding: 0; display: grid; gap: 1rem; }
  li {
    background: var(--cor-superficie);
    border: 1px solid var(--cor-borda);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
  }
  a { font-size: 1.15rem; font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .meta { margin: 0.35rem 0 0; font-size: 0.85rem; color: var(--cor-suave); }
  .descricao { margin: 0.5rem 0 0; color: var(--cor-suave); }
</style>
```

- [ ] **Step 2: Rodar o build**

Run: `npm run build`
Expected: sem erro.

- [ ] **Step 3: Verificação visual**

Run: `npm run dev`, abrir `http://localhost:4321/cases/` e `http://localhost:4321/blog/`. Confirmar
que cada item da lista aparece como um card, não mais como texto separado por linha embaixo.

- [ ] **Step 4: Commit**

```bash
git add src/components/ListaConteudo.astro
git commit -m "feat: cards na listagem de cases e blog"
```

---

### Task 5: Nav com item ativo e hover mais claros

**Files:**
- Modify: `src/components/Nav.astro:14-19` (bloco `<style>`)

- [ ] **Step 1: Adicionar sublinhado ao item ativo e transição no hover**

Em `src/components/Nav.astro`, substituir o bloco `<style>` inteiro:

```astro
<style>
  nav { max-width: var(--largura-leitura); margin: 0 auto; padding: 1.75rem 1.25rem 2.5rem; }
  ul { display: flex; flex-wrap: wrap; gap: 1.25rem; list-style: none; margin: 0; padding: 0; }
  a {
    color: var(--cor-suave);
    text-decoration: none;
    font-size: 0.95rem;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid transparent;
    transition: color 200ms ease, border-color 200ms ease;
  }
  a:hover { color: var(--cor-texto); border-color: var(--cor-borda); }
  a[aria-current='page'] {
    color: var(--cor-texto);
    font-weight: 600;
    border-color: var(--cor-destaque);
  }
</style>
```

- [ ] **Step 2: Rodar o build**

Run: `npm run build`
Expected: sem erro.

- [ ] **Step 3: Verificação visual**

Run: `npm run dev`, navegar entre as quatro rotas do menu. Confirmar que o item da página atual tem
sublinhado na cor de destaque, e que passar o mouse nos outros itens mostra uma transição suave, não
uma troca abrupta.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: destaque de nav ativo e hover"
```

---

### Task 6: Mais peso visual no hero

**Files:**
- Modify: `src/styles/global.css:34` (regra de `h1`)

**Interfaces:**
- Consumes: `--fonte-titulo` (Task 1).

- [ ] **Step 1: Aumentar o tamanho máximo do h1 e o espaço abaixo dele**

Em `src/styles/global.css`, trocar a linha:

```css
h1 { font-size: clamp(1.9rem, 5vw, 2.6rem); margin: 0 0 0.5rem; }
```

por:

```css
h1 { font-size: clamp(2.1rem, 6vw, 3.2rem); margin: 0.5rem 0 1rem; }
```

- [ ] **Step 2: Rodar o build**

Run: `npm run build`
Expected: sem erro.

- [ ] **Step 3: Verificação visual em celular e notebook**

Run: `npm run dev`. Nas DevTools, emular largura 375px e depois 1440px, abrir `/`. Confirmar que o
título "Sua operação cresceu. Os sistemas dela não." ocupa mais espaço visual que o texto abaixo dele,
nas duas larguras, sem quebrar em mais de 3 linhas no celular.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: mais peso visual no h1 do hero"
```

---

### Task 7: Fade sutil ao entrar na viewport

**Files:**
- Modify: `src/styles/global.css` (novas regras `.revelar` / `.revelar.visivel`)
- Modify: `src/layouts/Base.astro` (script inline de `IntersectionObserver`)

**Interfaces:**
- Produces: classe CSS `.revelar` (estado inicial oculto) e `.visivel` (estado revelado), aplicadas
  via JS a cada filho direto de `<main>`.

- [ ] **Step 1: Adicionar as regras de transição no CSS**

Em `src/styles/global.css`, adicionar ao final do arquivo:

```css
.revelar {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 280ms ease-out, transform 280ms ease-out;
}
.revelar.visivel { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .revelar { opacity: 1; transform: none; transition: none; }
}
```

A classe `.revelar` só é aplicada via JavaScript (Step 2). Sem JavaScript, nenhum elemento recebe a
classe e tudo fica visível com opacidade 1 desde o início — o fallback sem JS é o comportamento
padrão, não um caso especial a tratar.

- [ ] **Step 2: Adicionar o script de observação no layout base**

Em `src/layouts/Base.astro`, adicionar antes do fechamento de `</body>`:

```astro
    <Rodape />
    <script>
      const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!semMovimento) {
        const alvo = document.querySelectorAll('main > *');
        const observador = new IntersectionObserver(
          (entradas) => {
            for (const entrada of entradas) {
              if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
              }
            }
          },
          { threshold: 0.1 }
        );
        alvo.forEach((el) => {
          el.classList.add('revelar');
          observador.observe(el);
        });
      }
    </script>
  </body>
</html>
```

- [ ] **Step 3: Rodar o build**

Run: `npm run build`
Expected: sem erro. Astro processa o `<script>` como módulo, bundlado junto do site — sem CDN.

- [ ] **Step 4: Verificação visual com e sem movimento reduzido**

Run: `npm run dev`, abrir `/`. Confirmar que os blocos de conteúdo aparecem com um fade sutil ao rolar
a página. Nas DevTools, ativar a emulação de `prefers-reduced-motion: reduce` (Rendering tab) e
recarregar: confirmar que todo o conteúdo aparece direto, sem fade.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro
git commit -m "feat: fade sutil ao entrar na viewport, respeitando reduced motion"
```

---

### Task 8: Verificação final e checagem de confidencialidade

**Files:**
- Nenhum arquivo novo. Esta task só verifica o resultado das tasks 1-7.

- [ ] **Step 1: Build limpo**

Run: `npm run build`
Expected: build completo sem erro nem aviso.

- [ ] **Step 2: Checagem de confidencialidade**

Run: `npm run verificar`
Expected: script termina sem apontar nome de cliente, host, usuário, porta ou credencial. Se ele
falhar, ler a saída do script antes de qualquer commit — não ignorar.

- [ ] **Step 3: Navegação manual nas seis rotas**

Run: `npm run dev`. Abrir, em sequência: `/`, `/cases/`, `/cases/migracao-erp-legado-plataforma-dados/`,
`/blog/`, um post de `/blog/`, e `/sobre`. Confirmar em cada uma:
- título com a fonte nova aplicada;
- cards visíveis onde aplicável (home, cases, blog);
- nav mostrando a rota atual destacada;
- contraste de texto legível nos temas claro e escuro (DevTools → Rendering → emular
  `prefers-color-scheme`).

- [ ] **Step 4: Largura de celular**

Nas DevTools, emular 375px de largura e repetir a navegação do Step 3. Confirmar que nenhum card
estoura a largura da tela e que o hero não quebra em mais de 3 linhas.

- [ ] **Step 5: Push e confirmação do deploy**

```bash
git push origin main
```

Run: aguardar o workflow do GitHub Actions terminar (`gh run watch` ou checar a aba Actions do
repositório) e depois abrir `https://alinepalaoroo.github.io` pra confirmar que o visual novo está no
ar.
