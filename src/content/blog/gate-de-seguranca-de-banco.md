---
titulo: Antes de confiar na permissão do banco, finja ser o invasor
descricao: Configurar regra de acesso por linha é fácil. Provar que ela funciona exige simular um cliente sem permissão e medir o que ele consegue ver.
publicadoEm: 2026-07-28
tags: ["segurança", "dados"]
rascunho: false
---

## O erro mais comum

A forma mais comum de checar segurança de banco é ler a regra escrita e concluir que ela funciona. A regra existe, parece correta, então o dado está protegido.

Só que regra escrita e regra em funcionamento são coisas diferentes. Essa diferença só aparece quando alguém tenta, de fato, ler o que não deveria.

Ler a configuração e concluir que ela está correta é um exercício de leitura, não de teste. Ele confirma que a intenção foi escrita do jeito certo. Não confirma que o banco, na hora da consulta, aplica essa intenção sem falha.

## O que é segurança de acesso por linha

Numa plataforma de dados em produção, apliquei segurança de acesso por linha: regra dentro do próprio banco que decide, linha por linha de uma tabela, o que cada usuário pode ver. Em vez de deixar essa decisão para cada aplicação que consulta o banco separadamente.

Escrever essa regra é a parte fácil. Provar que ela funciona é uma tarefa diferente, e é nela que mora o risco de confiar sem checar.

## Fingir ser o invasor

A verificação que construí simula um cliente sem permissão administrativa e mede o que esse cliente consegue de fato ler.

Não basta simular o acesso e checar se apareceu um erro numa tentativa isolada. É preciso ler o resultado real da consulta, linha por linha, e comparar com o que deveria estar visível para aquele nível de permissão. Se sobrar uma linha que não deveria aparecer, a regra escrita não é a regra em funcionamento.

Essa verificação assume o papel de quem não deveria ter acesso e pergunta, na prática, o que essa pessoa consegue ver. É uma pergunta diferente de checar se a regra está escrita direito, e é a única que responde se o dado está mesmo protegido.

Nenhuma leitura de configuração substitui essa medição. A configuração descreve intenção. A medição descreve resultado. E é o resultado que chega até o cliente errado, se algo estiver furado.

## Por que isso não pode esperar o trimestre

Uma verificação de segurança rodada uma vez, manualmente, prova que o banco estava seguro naquele momento. Não prova nada sobre o estado do banco depois da próxima mudança de estrutura.

Toda mudança de estrutura pode alterar, sem intenção, o efeito de uma regra de acesso escrita antes dela. Por isso a verificação de simular o cliente sem permissão precisa rodar automaticamente antes de cada mudança ir para produção, não numa auditoria de vez em quando.

Rodando a cada mudança, o vazamento é pego antes de qualquer cliente real acessar dado que não devia ver. Rodando só de tempos em tempos, um vazamento pode ficar exposto por um tempo antes de alguém notar.

A pergunta que importa não é se a regra de acesso foi escrita direito uma vez. É se ela continua funcionando depois de cada mudança que vem depois dela. Só quem simula o invasor a cada mudança consegue responder isso com dado real, e não com confiança.
