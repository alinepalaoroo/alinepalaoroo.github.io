---
titulo: Migração de um ERP legado somente leitura para plataforma de dados própria
descricao: Como organizei em camadas o dado de uma operação de agritech com e-commerce que dependia de um ERP antigo sem acesso de escrita.
setor: Agritech com e-commerce
periodo: 2026, cerca de dois meses e meio
stack: ["PostgreSQL", "Supabase self-hosted", "Docker Swarm", "Traefik", "TypeScript", "Next.js"]
ordem: 1
---

## O contexto

O projeto foi feito para uma operação de agritech com e-commerce. Todo o dado dessa operação vivia dentro de um ERP (sistema de gestão que concentra cadastro, estoque e financeiro em um só lugar) legado, em Firebird, acessível apenas para leitura.

Quatro aplicações dependiam desse dado: painel administrativo, API, loja de e-commerce e gateway de mensageria.

O projeto nasceu para construir, a partir desse ERP, uma plataforma de dados própria, capaz de alimentar essas quatro aplicações a partir de um único ponto confiável.

## A restrição que mudou tudo

O ERP de origem só permitia leitura. Não havia caminho de escrita nele, e mudar isso não estava no escopo do projeto.

Essa restrição elimina de saída a solução mais óbvia, que seria ajustar a estrutura direto na origem: criar um campo novo, corrigir um tipo de dado, ligar uma automação dentro do próprio banco do ERP. Nada disso era possível. Toda transformação precisava acontecer fora do ERP, em uma camada construída para receber o que ele expõe e devolver algo estável para quem consome.

Foi essa condição, mais do que qualquer preferência técnica, que definiu o formato do projeto inteiro. Se a origem não pode mudar, a plataforma precisa ser desenhada para absorver o formato dela como ele é, e não como se gostaria que fosse.

## A decisão: camadas em vez de cópia

A resposta a essa restrição foi organizar o dado em camadas, em vez de fazer uma cópia única e direta do ERP.

A primeira camada é de ingestão bruta: uma réplica fiel do que sai do ERP, sem nenhuma regra de negócio aplicada ainda. Em seguida vem uma camada de staging (área intermediária de preparação, onde o dado ganha tipo e formato padronizado antes de virar algo definitivo).

Depois da staging vêm os schemas canônicos (a estrutura de banco tratada como versão oficial de um assunto), um por domínio de negócio: catálogo, vendas, estoque, financeiro, fiscal, compras, CRM (histórico de relacionamento com cliente), mensageria e comércio. É nos schemas canônicos que a regra de negócio de fato é aplicada.

Por fim, uma camada única de consumo reúne o que os schemas canônicos produzem. É o único ponto que as aplicações acessam: painel administrativo, API, loja de e-commerce e gateway de mensageria leem todos dessa mesma camada.

<svg viewBox="0 0 360 300" role="img" aria-label="Fluxo de dados em cinco camadas, do ERP legado até a camada de consumo" style="width:100%;max-width:360px;margin:2rem auto;display:block;color:var(--cor-texto)">
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="30" y="8" width="300" height="40" rx="4" stroke-dasharray="4 3" />
    <rect x="30" y="76" width="300" height="40" rx="4" />
    <rect x="30" y="144" width="300" height="40" rx="4" />
    <rect x="30" y="212" width="300" height="40" rx="4" />
    <path d="M180 48 L180 70 M174 64 L180 71 L186 64" />
    <path d="M180 116 L180 138 M174 132 L180 139 L186 132" />
    <path d="M180 184 L180 206 M174 200 L180 207 L186 200" />
  </g>
  <g fill="currentColor" font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
    <text x="180" y="27" font-size="13">ERP legado, somente leitura</text>
    <text x="180" y="42" font-size="10" opacity="0.65">Firebird</text>
    <text x="180" y="95" font-size="13">Ingestão bruta e staging</text>
    <text x="180" y="110" font-size="10" opacity="0.65">cópia fiel, sem regra de negócio</text>
    <text x="180" y="163" font-size="13">Schemas canônicos por domínio</text>
    <text x="180" y="178" font-size="10" opacity="0.65">catálogo, vendas, estoque, financeiro</text>
    <text x="180" y="231" font-size="13">Camada única de consumo</text>
    <text x="180" y="246" font-size="10" opacity="0.65">painel, API, loja, mensageria</text>
  </g>
  <text x="180" y="282" fill="currentColor" opacity="0.65" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" text-anchor="middle">Cada camada só conhece a de cima.</text>
</svg>

Cada camada só conhece a de cima. A camada de consumo não sabe que existe um ERP em Firebird por trás dela, só enxerga o schema canônico. Se a origem mudar de forma, o impacto fica contido nas camadas de baixo, sem quebrar quem consome.

A infraestrutura de destino é PostgreSQL com Supabase self-hosted (a mesma camada de banco e API do Supabase, mas instalada e operada em servidor próprio, não no serviço gerenciado), com segurança de acesso aplicada dentro do próprio banco, por linha, já em produção. Isso quer dizer que a regra de quem pode ver qual dado fica no banco, não espalhada em cada aplicação que o consome.

## Por que registrei 19 decisões por escrito

Ao longo do projeto, registrei 19 decisões de arquitetura por escrito. Entre elas, o padrão de nomeação usado em toda migração de banco, a própria topologia de camadas descrita acima, e a definição de uma branch canônica única como referência de código.

O motivo não é burocracia. Em um projeto que mexe na fundação de dado de uma operação em funcionamento, a maior fonte de retrabalho é decisão tomada de cabeça, que depois alguém desfaz sem saber que ela existia ou por que foi tomada daquela forma. Escrever a decisão no momento em que ela é tomada, com o motivo junto, evita que o mesmo debate se repita meses depois, e dá para quem entra depois no projeto entender o porquê sem precisar perguntar.

## Como uma mudança chegava em produção

Toda alteração de estrutura de banco passava pela mesma sequência antes de qualquer coisa ir para produção: registro de um baseline (o estado do banco antes da mudança, guardado como ponto de referência), execução simulada da alteração, e um caminho de reversão já definido antes mesmo de aplicar.

Essa ordem existe porque, em um banco que várias aplicações já dependem, o custo de errar uma mudança de estrutura é alto. Simular antes mostra o que a alteração de fato faz, sem esperar para descobrir em produção. E ter a reversão pronta antes de aplicar significa que, se algo sair diferente do esperado, o caminho de volta já existe, em vez de ser improvisado sob pressão.

## O resultado

O que passou a existir foi uma plataforma de dados própria, em camadas, com uma única fonte de consumo para o painel administrativo, a API, a loja de e-commerce e o gateway de mensageria, todos lendo do mesmo lugar em vez de cada um interpretar o ERP à sua maneira.

O trabalho de arquitetura, migração e decisão ficou documentado: as 19 decisões escritas continuam disponíveis como referência, e a sequência de baseline, execução simulada e reversão definida virou o caminho padrão para qualquer mudança de estrutura seguinte.

No repositório do projeto, 753 dos 1.477 commits registrados são meus, uma medida direta de quanto desse trabalho passou pela minha mão diretamente, do desenho das camadas até a migração em si. O projeto todo levou cerca de dois meses e meio, em 2026.
