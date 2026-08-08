# Design: redesign visual do site (identidade e hierarquia)

> Gerado em 2026-08-08 a partir de sessão de brainstorming.
> Contexto de origem: o site (`docs/superpowers/specs/2026-07-26-site-blog-design.md`) já está no ar
> com conteúdo completo (home, sobre, 1 case, 2 posts), mas a usuária avaliou o frontend como "simples
> demais": falta hierarquia visual e falta identidade visual própria.

---

## 1. Problema

O CSS atual (`src/styles/global.css`) usa fonte do sistema, uma única cor de destaque e nenhum
componente visual distinto: ofertas na home são parágrafos com borda esquerda, a navegação é só
links de texto, não existe tratamento de hero. O conteúdo é bom mas tudo tem o mesmo peso visual, e o
site não é reconhecível como algo autoral — podia ser o blog de qualquer pessoa.

## 2. Objetivo

Dar hierarquia visual clara (o que é título, o que é oferta, o que é prova, o que é CTA) e identidade
própria (tipografia com caráter, sistema de cor formalizado), sem mudar uma palavra do conteúdo e sem
contradizer nenhuma restrição do spec original do site.

Critério de sucesso: quem abre a home entende em cinco segundos que existem duas ofertas concretas
antes de ler o texto corrido, e o site tem uma cara que não é a de um template genérico de Markdown.

## 3. Restrições (herdadas do spec original, todas mantidas)

- **Custo zero.** Nenhum serviço pago, nenhuma assinatura, nenhum domínio comprado agora.
- **Sem CDN de terceiro em runtime.** Fonte própria precisa ser self-hosted (arquivo servido pelo
  próprio site), não `<link>` pro Google Fonts.
- **Conteúdo intocado.** Esta é uma mudança puramente visual. Nenhum texto de `src/pages`,
  `src/content` ou `src/components` muda de significado.
- **Confidencialidade.** Nenhuma mudança visual expõe nome de cliente, host, usuário, porta ou
  credencial. `npm run verificar` continua passando.
- **Tema claro e escuro.** Todo token novo precisa de par claro/escuro em `global.css`.
- **Mobile-first.** O link é enviado em DM e abre no telefone primeiro.
- **Posicionamento 100% PJ.** Redesign não adiciona nada relacionado a busca de vaga CLT.

## 4. Abordagem escolhida

**Restyle incremental em cima da estrutura Astro existente**, sem trocar arquitetura, sem novo
gerenciador de conteúdo, sem framework de UI.

Alternativas descartadas:

- **Reescrever em outro gerador de site ou adicionar Tailwind/UI kit.** Custo de migração alto pra um
  ajuste que é 100% CSS e um componente novo (card de oferta). Contradiz a decisão original de manter
  a stack simples.
- **Ilustração/foto de banco de imagem pra dar personalidade.** Explicitamente descartado no spec
  original: "a ilustração do site são os diagramas de arquitetura, porque o diagrama é a prova."
  Mantido aqui.

O critério que decidiu: a mudança é inteiramente em `global.css`, nos `<style>` locais dos
componentes/páginas, e numa fonte nova. Nenhum arquivo de conteúdo é tocado.

## 5. Sistema de design

### 5.1 Cor

Mantém o verde-petróleo já usado (`--cor-destaque`) como acento único — é a cor que já existe no site
publicado e não há razão pra trocar por outra só porque o gerador de design sugere azul por padrão.
Formaliza como sistema de tokens em vez de uma variável solta:

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--cor-fundo` | `#fbfbf9` | `#141414` | fundo da página (mantido) |
| `--cor-superficie` | `#f2f1ec` | `#1c1c1a` | fundo de card (novo) |
| `--cor-texto` | `#1c1c1a` | `#ededea` | texto principal (mantido) |
| `--cor-suave` | `#5f5f58` | `#a3a39c` | texto secundário (mantido) |
| `--cor-borda` | `#e2e2dc` | `#2c2c2a` | borda de card e divisores (mantido) |
| `--cor-destaque` | `#1f6f5c` | `#5fbfa3` | acento único: link, CTA, título de oferta (mantido) |

Contraste verificado manualmente contra WCAG AA (4.5:1) pra texto sobre `--cor-fundo` e
`--cor-superficie`, nos dois temas, antes do commit final.

### 5.2 Tipografia

- **Títulos (h1, h2, h3):** Space Grotesk, peso 500 uniforme. Caráter técnico e geométrico, sem ficar
  com cara de brutalismo (não usa peso 700+ nem caixa alta).
- **Corpo:** mantém a pilha de fonte do sistema atual (`ui-sans-serif, system-ui...`). Texto longo
  continua rápido de renderizar e sem depender de arquivo pra ler o conteúdo principal.
- **Empacotamento:** pacote `@fontsource/space-grotesk` (self-hosted via npm, arquivo woff2 embutido
  no build, sem request externo em runtime, sem CDN, sem conta, gratuito). Só os pesos 500 são
  importados, pra não inchar o bundle com pesos não usados.

### 5.3 Componentes

- **Nav:** item ativo e hover ganham sublinhado ou fundo sutil (não só troca de cor de texto), pra
  reforçar orientação sem virar barra pesada.
- **Hero (home):** h1 com `clamp()` maior que hoje, mais respiro vertical antes do primeiro parágrafo.
  Sem imagem.
- **Cards de oferta (`.oferta` na home):** viram cartão de verdade — fundo `--cor-superficie`, borda
  `--cor-borda`, `border-radius` pequeno (6-8px), padding interno em vez de só borda esquerda.
  Título da oferta em `--cor-destaque`.
- **Case e Blog (listagem):** cada item de `ListaConteudo.astro` ganha o mesmo tratamento de card leve
  dos componentes de oferta, pra consistência visual entre home, cases e blog.
- **Rodapé:** sem mudança estrutural, só usa os tokens de cor atualizados.

### 5.4 Movimento

Fade sutil (opacidade + deslocamento vertical de 8-12px) quando uma seção entra na viewport, via
`IntersectionObserver` nativo (sem biblioteca nova tipo GSAP, mantendo dependência zero). Duração
250-300ms. Respeita `prefers-reduced-motion: reduce` — se ativo, elementos aparecem direto, sem
transição.

### 5.5 Fora de escopo

- Qualquer mudança de texto, título de página ou conteúdo de case/post.
- Ilustração, foto ou diagrama novo (fica pra quando houver um segundo case, conforme spec original).
- Dark mode toggle manual (continua seguindo `prefers-color-scheme` do sistema, como já é hoje).
- Novo componente de formulário ou analytics.

## 6. Verificação

Antes de qualquer commit:

1. `npm run build` sem erro e sem aviso.
2. `npm run verificar` (checagem de confidencialidade) continua passando.
3. Navegação manual nas seis rotas (`/`, `/cases/`, `/cases/<slug>`, `/blog/`, `/blog/<slug>`, `/sobre`).
4. Contraste de texto conferido nos dois temas (claro e escuro).
5. Leitura em largura de celular (375px) e notebook (1440px).
6. `prefers-reduced-motion` testado (DevTools → emular).

Após deploy: confirmar visualmente que `alinepalaoroo.github.io` reflete o novo visual nas seis rotas.
