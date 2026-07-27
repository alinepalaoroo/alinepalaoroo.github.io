---
titulo: Por que eu registro decisão de arquitetura mesmo trabalhando sozinha
descricao: "Documentar decisão parece burocracia de time grande. Trabalhando só, ela me protege de um inimigo específico: eu mesma, três semanas depois."
publicadoEm: 2026-07-27
tags: ["governança", "arquitetura"]
rascunho: false
---

## A objeção que eu mesma tinha

Registrar decisão de arquitetura parece coisa de time grande. Quando trabalho sozinha, cheguei a achar que documentar decisão era formalidade sem função real.

Afinal, quem vai ler aquilo, se sou eu que decido e sou eu que sigo com o projeto até o fim?

Levou um projeto inteiro para eu entender que a pergunta certa não é quem vai ler. É quem, no futuro, vai duvidar.

Trabalhando sozinha, parece que só existem duas pessoas na equação: eu agora e eu depois. Na prática, é exatamente por isso que o registro importa. Não tem ninguém além de mim para lembrar o motivo de uma escolha, e memória de decisão técnica some rápido quando a atenção já foi para o próximo problema.

## O risco que o registro evita

Numa plataforma de dados construída ao longo de cerca de dois meses e meio, uma decisão de arquitetura tomada numa semana pode parecer óbvia enquanto o motivo ainda está fresco na cabeça.

Três semanas depois, sem o registro desse motivo, ela para de parecer óbvia. Sobra só o resultado, e resultado sozinho pode parecer arbitrário para quem volta a olhar.

É nesse ponto que uma decisão certa corre o risco de ser desfeita sem que ninguém perceba que ela já tinha sido tomada, e por quê. Não porque a decisão estivesse errada, mas porque o motivo dela não sobrou em lugar nenhum além da memória de quem decidiu.

## O que um registro precisa ter, no mínimo

Ao longo desse projeto, registrei por escrito 19 decisões de arquitetura. Entre elas, a própria topologia de camadas, o padrão de nomeação usado em toda migração de banco (mudança na estrutura das tabelas, como criar uma coluna nova ou alterar um tipo de dado) e a definição de uma branch (linha de desenvolvimento dentro do controle de versão do código) canônica única como referência.

Cada um desses registros tem três partes. A decisão tomada. A alternativa que foi descartada. O motivo pelo qual essa alternativa perdeu.

Sem a alternativa descartada, o registro não protege nada. Quem lê só a decisão final não sabe que outra opção já foi considerada e rejeitada. Então considera de novo, do zero, e corre o risco de decidir diferente sem perceber que já houve essa discussão.

## O que muda quando alguém novo entra

Se um dia esse projeto ganhar mais uma pessoa, ela não vai precisar me perguntar por que a estrutura é assim e não de outro jeito. Vai ler o registro, entender o motivo, e discordar dele com argumento, se for o caso, em vez de discordar por desconhecimento.

Trabalhando sozinha, esse alguém novo muitas vezes sou eu mesma, meses depois, com menos memória do contexto do que eu tinha na hora da decisão.

Documentar decisão não é sobre comunicar para um time que ainda não existe. É sobre impedir que uma decisão certa seja revertida em silêncio, só porque o motivo dela ficou só na minha cabeça e a minha cabeça esqueceu.

Escrever o porquê junto com a decisão não impede que ela mude depois. Impede que ela mude por esquecimento, em vez de mudar por um motivo novo e melhor do que o antigo.
