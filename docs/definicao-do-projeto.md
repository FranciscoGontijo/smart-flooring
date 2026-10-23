# Smart Flooring App: definição do projeto

> Versão 0.10, 23/10/2026 (0.2: projeto criado pelo PM, agendamento, chat e notificações; 0.3: recusa pelo inspetor, papel de administrador, visibilidade e e-mails; 0.4: "vendedor" virou project manager (PM), etapas do projeto, prazos, Update/Close work order, a data do assessment passa a ser do PM; 0.5: nome "projeto" na interface, reabertura, motivos fixos de fechamento, PM pode fazer o assessment; 0.6: lista de materiais e waste; 0.7: lista genérica por tipo de produto, guia de consumo em aberto, waste de diagonais/herringbone, carpet fora; 0.8: stack definida, tudo pela API com JWT próprio; 0.9: código em inglês e estrutura da API; 0.10: dois formulários à escolha do inspetor, layout como rascunho à mão livre por área). Documento vivo: atualizar quando uma decisão mudar.
> Nenhum código foi escrito ainda. Este documento é a base para começar.

## 1. Objetivo

Reduzir o trabalho manual entre a inspeção de um serviço de piso e a parte burocrática com a loja ou o cliente.

O PM cadastra o lead como projeto, liga para o cliente, combina a data do assessment com o inspetor e registra no sistema. No local, o inspetor descreve o serviço em texto livre, no celular, e anexa fotos. Uma IA transforma essa descrição em dados estruturados, e o sistema gera os documentos a partir dos modelos da Smart Flooring. O inspetor revisa e envia. O PM ajusta o que precisar, aceita, e acompanha o projeto pelas etapas de venda até a instalação.

## 2. Usuários

| Papel         | Quantidade inicial   | Dispositivo                 | O que faz                                                                                                                                                               |
| ------------- | -------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inspetor      | ~5                   | Celular                     | Recebe o projeto com a data marcada, descreve o serviço, anexa fotos, revisa e envia os documentos gerados                                                              |
| PM            | ~5                   | Computador (principalmente) | Project manager: cadastra o lead, marca o assessment, atribui o inspetor, revisa os documentos, ajusta preços, devolve ou aceita, e atualiza as etapas até a instalação |
| Administrador | 1+                   | Qualquer                    | Vê todos os projetos. As funções administrativas serão definidas depois (não é prioridade)                                                                              |
| Instalador    | (fora da plataforma) | n/a                         | Só recebe o PDF de repasse, enviado pelo PM                                                                                                                             |

Visibilidade:

- **PM** vê só os projetos que ele criou. Não há nada global.
- **Inspetor** vê só os projetos atribuídos a ele.
- **Administrador** vê todos os projetos.

- A interface tem seletor de idioma **Português / English**, salvo no perfil de cada usuário.
- Os documentos para cliente e loja saem **sempre em inglês**.

## 3. Fluxo

O centro do sistema é o **projeto** (na interface: "Projeto" / "Project"). Ele nasce com o PM e passa por duas camadas:

| Camada                       | Para quem                    | O que responde                                  |
| ---------------------------- | ---------------------------- | ----------------------------------------------- |
| **Etapa** (funil do projeto) | PM e admin                   | "Em que ponto o projeto está, e está atrasado?" |
| **Status da inspeção**       | Inspetor e PM, só na etapa 2 | "Quem tem que fazer o quê agora na inspeção?"   |

### 3.1 Etapas

| #   | Etapa                            | O que acontece                                                                                       | Prazo                      | Termina quando                |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------- |
| 1   | **Novo lead: marcar assessment** | PM cadastra o projeto, liga para o cliente, combina a data com o inspetor e registra data + inspetor | Data que o PM definir      | Data do assessment registrada |
| 2   | **Assessment marcado**           | Inspeção e documentos (seção 3.4)                                                                    | Data do assessment         | PM aceita os documentos       |
| 3   | **Em processo de venda**         | PM manda quote, contrato e documentos para a loja ou o cliente, fora da plataforma                   | 3 dias sem update (padrão) | Cliente/loja aprova           |
| 4   | **Venda confirmada**             | PM combina a instalação e manda o repasse ao instalador, fora da plataforma                          | 3 dias sem update (padrão) | Data da instalação registrada |
| 5   | **Instalação marcada**           | Aguardando o dia                                                                                     | Data da instalação         | Instalação feita              |
| 6   | **Completo**                     | Fim                                                                                                  | n/a                        | n/a                           |
| x   | **Fechado**                      | _Fechar projeto_, com motivo, em qualquer etapa. Pode ser **reaberto**                               | n/a                        | n/a                           |

A tela principal do PM é um **quadro (ou lista) com as etapas**, com os projetos atrasados no topo.

### 3.2 Prazos e alertas

- **Quem define as datas é o PM** (assessment, instalação ou qualquer data de acompanhamento). O sistema não impõe prazos próprios, com uma exceção:
- **Etapas 3 e 4:** se o PM não colocar data, o prazo padrão é **3 dias desde o último update**. Cada _Atualizar projeto_ renova o prazo.
- **Passou 1 dia da data → o card fica vermelho e o PM é alertado** (notificação + e-mail).

### 3.3 Atualizar projeto e Fechar projeto

É a ação única do PM para manter o projeto em dia, porque o que acontece nas etapas 3 a 6 vive **fora da plataforma**. Num _Atualizar projeto_ (_Update project_) o PM pode:

- mudar a etapa;
- definir ou alterar datas (assessment, instalação, próximo acompanhamento);
- escrever uma nota, que vai para a linha do tempo.

**Fechar projeto** (_Close project_): encerra o projeto em qualquer etapa, com um **motivo** obrigatório de uma lista fixa:

- Preço
- Concorrente
- Cliente desistiu
- Sem resposta do cliente
- Outro (com texto livre obrigatório)

O projeto vai para a etapa **Fechado** e guarda a etapa em que estava.

**Reabrir projeto:** um projeto fechado pode ser reaberto pelo PM. Ele volta para a **etapa em que foi fechado**, com uma nota de reabertura na linha do tempo. O PM pode mudar a etapa em seguida, com um _Atualizar projeto_.

### 3.4 Etapa 1: atribuição e data

```
[PM]        cadastra o projeto, liga para o cliente,
            combina a data com o inspetor (chat ou fora da plataforma)
            e registra data + inspetor  ◄─────────────────┐
                 ↓  e-mail + notificação ao inspetor      │
[Inspetor]  vê cliente, endereço e data                   │
                 └─ recusa (com motivo) ───────────────────┘ PM atribui outro
```

- **A data é decidida pelo PM**, conversada com o inspetor. Quem alimenta a plataforma é sempre o PM.
- Ao registrar data + inspetor, o projeto já vai para a **etapa 2**. Não há passo de "aceitar": a data já foi combinada com o inspetor.
- Até começar o formulário, o inspetor pode **recusar o projeto**, com motivo. O projeto volta à etapa 1, com o PM, que atribui outro inspetor.
- Se o PM mudar a data, o inspetor é avisado.

### 3.5 Etapa 2: inspeção e documentos

Com o assessment marcado, o inspetor tem o botão **"Preencher formulário"**, que inicia a inspeção:

```
[Inspetor]  em inspeção → gerando (IA) → em revisão → enviado ao PM
                ↑                                          ↓
[PM]            └──── devolvido ao inspetor ←──── em análise → aceito
                         (com motivo)               (edita e aceita)
```

Status da inspeção:

| Status        | Responsável   | Próximo passo                            |
| ------------- | ------------- | ---------------------------------------- |
| `agendado`    | Inspetor      | Preencher o formulário (ou recusar)      |
| `em_inspecao` | Inspetor      | Descrever o serviço, anexar fotos, gerar |
| `gerando`     | Sistema (api) | Processar a IA                           |
| `em_revisao`  | Inspetor      | Revisar e enviar ao PM                   |
| `em_analise`  | PM            | Ajustar, devolver ou aceitar             |
| `devolvido`   | Inspetor      | Corrigir e reenviar                      |
| `aceito`      | n/a           | Projeto segue para a etapa 3             |

Regras:

- Só quem é responsável naquele momento edita os documentos.
- O inspetor pode **gerar de novo** (reprocessar a IA) enquanto a inspeção está com ele.
- O PM pode **corrigir ele mesmo** ou **devolver ao inspetor**. Ao devolver, informa o motivo, que aparece no topo da tela do inspetor e no chat.
- **O PM pode fazer o assessment ele mesmo.** Na etapa 1, em vez de atribuir um inspetor, ele atribui a si próprio. Nesse caso ele preenche o formulário (no celular ou no computador), e o passo de revisão fica curto: em vez de "enviar ao PM", ele **aceita direto** os documentos (`em_revisao` → `aceito`). Sem notificações para si mesmo.
- **Depois do `aceito`, o inspetor sai do projeto:** ele some da lista dele, perde o acesso e não recebe mais notificações.
- Todo o histórico (etapas, status, quem, quando, motivo) fica guardado.

### 3.6 Chat e linha do tempo

Cada projeto tem uma **linha do tempo** que mistura:

- **mensagens** entre PM e inspetor (texto e, opcionalmente, foto), durante as etapas 1 e 2;
- **eventos do sistema**: "PM atribuiu a Fulano para 23/10 às 9h", "Devolvido: falta a medida da cozinha";
- **updates do PM** (_Atualizar projeto_), com as notas, fechamentos e reaberturas.

O chat é em tempo real, entregue pela API via SSE (seção 5.1).

### 3.7 Notificações

Toda notificação aparece **dentro do sistema** (sininho + contador). **E-mail só para a lista fixa de eventos abaixo.** O chat nunca gera e-mail.

| Evento                         | Quem recebe             | E-mail |
| ------------------------------ | ----------------------- | ------ |
| Projeto atribuído (com a data) | Inspetor                | Sim    |
| Data do assessment alterada    | Inspetor                | Sim    |
| Inspetor recusou o projeto     | PM (com o motivo)       | Sim    |
| Inspetor enviou os documentos  | PM                      | Sim    |
| PM devolveu ao inspetor        | Inspetor (com o motivo) | Sim    |
| Prazo vencido há 1 dia         | PM                      | Sim    |
| Nova mensagem no chat          | O outro participante    | Não    |

Push no celular (PWA instalado na tela inicial) fica para uma segunda versão.

## 4. Documentos

### 4.1 Documentos do inspetor (editáveis por ele)

| Documento          | Como é gerado                                                                                              | Saída                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | -------------------------- |
| Lista de serviços  | **IA extrai** do texto: serviço, quantidade, unidade, área, observação                                     | Tabela editável no sistema |
| Lista de materiais | Gerada pelos serviços + guia de consumo + waste (seção 4.4), por **tipo de produto**; **IA sugere** extras | Tabela editável no sistema |
| Layout das áreas   | Rascunho à mão livre por área (só representação, sem medidas) + tabela de áreas + fotos                    | PDF                        |
| Moisture readings  | **IA extrai** as leituras do texto → formulário por área, conferido pelo inspetor                          | DOCX                       |

### 4.2 Documentos do PM

| Documento               | Como é gerado                                                                  | Saída                 |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------- |
| Orçamento / quote       | **Código**: serviços × tabela de preços. O PM pode alterar preço linha a linha | Tabela editável → PDF |
| Repasse ao instalador   | **Código**: serviços × tabela de pagamento do instalador                       | PDF                   |
| Documentos do inspetor  | Os mesmos da seção 4.1, já aprovados                                           | PDF / DOCX            |
| Contrato Smart Flooring | **Template fixo** com campos preenchidos. Só para **cliente particular**       | PDF                   |

### 4.3 Princípios

1. **A IA gera dados, não documentos.** Ela devolve JSON validado por schema. O código preenche os modelos, então o layout é sempre idêntico ao modelo.
2. **Contas são do código.** Quantidades, preços, totais e perdas nunca são calculados pela IA.
3. **Texto jurídico não passa pela IA.** O contrato é um template fixo.
4. **O inspetor confere os números antes de qualquer documento.** A extração vira tabela, e a tabela confirmada é a fonte dos documentos.
5. **Preço de tabela e preço final são guardados separadamente**, e as linhas alteradas pelo PM ficam marcadas. Isso mostra quais preços da tabela precisam de revisão.

### 4.4 Lista de materiais

A lista de materiais é **generalizada**: mostra o **tipo de produto** (ex.: Floating Floor, Tile, Hardwood, Thin-set, Underlayment), não o produto exato, a marca ou a cor. Também não registra quem fornece: a plataforma só precisa da lista.

Ela é gerada a partir dos **serviços** que o inspetor definiu: cada serviço consome certos tipos de material, em quantidades que dependem das medidas (área, perímetro, portas, degraus). A IA só entrega as **medidas** e pode **sugerir** itens extras, que entram marcados como sugestão.

#### Guia de consumo de materiais (a definir mais adiante)

Haverá um **guia de consumo** da Smart Flooring, usado para montar a lista: quais materiais cada serviço usa e quanto de cada um por unidade (ex.: quantos sacos de thin-set por sq ft de tile, quanto de underlayment por sq ft de floating floor, quanto quarter round por linear ft de perímetro).

Exemplo do formato, para "Install Floating Floor":

| Material (tipo) | Unidade   | Base de cálculo        | Consumo         | Waste padrão |
| --------------- | --------- | ---------------------- | --------------- | ------------ |
| Floating Floor  | sq ft     | área                   | 1 sq ft / sq ft | 10%          |
| Underlayment    | sq ft     | área                   | 1 sq ft / sq ft | 10%          |
| Quarter round   | linear ft | perímetro − portas     | 1 lf / lf       | 10%          |
| Transição       | unidade   | nº de portas/passagens | 1 / passagem    | 0%           |

**Em aberto:** o conteúdo do guia, e se ele vira uma tabela que o código aplica (mais previsível) ou um documento que a IA lê (mais flexível). Isso será decidido quando o guia for montado.

#### Waste

- **Padrões da Smart Flooring:**

  | Piso / instalação                                           | Waste |
  | ----------------------------------------------------------- | ----- |
  | Floating floor (LVP, laminado), hardwood: instalação normal | 10%   |
  | Tile: instalação normal                                     | 12%   |
  | Tile diagonal                                               | 17%   |
  | LVP diagonal                                                | 17%   |
  | Herringbone                                                 | 17%   |

- O waste fica **visível em cada linha** e o **inspetor pode mudar** (ex.: cômodo com muitos recortes). O PM também, se pegar o projeto em análise.
- Quantidade final = quantidade medida × (1 + waste), arredondada para cima na unidade do material.
- **Carpet fica fora do escopo** por agora.

#### Colunas da lista

| Coluna               | Exemplo                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| Área                 | Living room                                                                   |
| Categoria            | Piso / Underlayment / Acabamento / Transição / Preparação / Adesivo e fixação |
| Material (tipo)      | Floating Floor                                                                |
| Unidade              | sq ft                                                                         |
| Quantidade medida    | 500                                                                           |
| Waste %              | 10% (editável)                                                                |
| Quantidade com waste | 550                                                                           |
| Origem               | guia / sugestão da IA / manual                                                |
| Observação           | texto livre                                                                   |

A lista sai **agrupada por categoria**, com subtotal por área e total geral, e o inspetor confere antes de enviar.

### 4.5 Fora do escopo (por agora)

- Modelos das lojas (Home Depot, Lowe's etc.): o PM usa o portal da loja.
- Carpet.
- Acesso do instalador.
- Ditado por voz (próximo passo provável).
- Editor de planta com medidas (o layout é só um rascunho à mão livre, D38).

## 5. Arquitetura

### 5.1 Visão geral

```
┌──────────────┐  REST + SSE   ┌──────────────────────┐      ┌───────────────────────┐
│  apps/web    │ ────────────► │  apps/api            │ ───► │  Supabase             │
│  Next.js     │ ◄──────────── │  Express (TS)        │      │  Postgres · Storage   │
│  (Vercel)    │  cookies      │  auth JWT · regras   │      │  (só acesso servidor) │
└──────┬───────┘  httpOnly     │  jobs · IA · PDF/DOCX│      └───────────▲───────────┘
       │                       └──────────┬───────────┘                  │
       │  upload direto com URL assinada  │ Claude · e-mail               │
       └──────────────────────────────────┼───────────────────────────────┘
```

**Tudo passa pela API (decidido em 20/10, substitui a opção A).** Como a autenticação é própria (JWT), o front não fala com o Supabase direto: ele chama só o Express. O Supabase é usado como **Postgres + Storage**, acessados apenas pelo servidor. As regras de acesso (quem vê qual projeto) ficam na API, não em RLS.

- **Fotos e arquivos:** o bucket é privado. Para enviar, a API devolve uma **URL de upload assinada** e o celular sobe a foto direto para o Storage, sem passar o arquivo pelo Express. Para ver, a API devolve URLs assinadas de curta duração.
- **Tempo real** (chat, notificações, status dos jobs): pela própria API, com **SSE** (Server-Sent Events). As mensagens são enviadas por REST, e o SSE só empurra as novidades.

### 5.2 Stack

| Parte       | Escolha                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Monorepo    | **Turborepo + pnpm**                                                                                                                                   |
| Linguagem   | **TypeScript** em tudo                                                                                                                                 |
| Front       | **Next.js** (App Router) + **Tailwind** + **shadcn/ui**; react-hook-form + zod nos formulários; TanStack Query para chamar a API; next-intl para PT/EN |
| API         | **Express**                                                                                                                                            |
| Banco       | **PostgreSQL no Supabase**, via **Prisma** (schema, migrações e tipos)                                                                                 |
| Storage     | Supabase Storage (bucket privado)                                                                                                                      |
| Auth        | **JWT próprio** (seção 5.5)                                                                                                                            |
| IA          | **Claude** (API da Anthropic), com saída estruturada validada por zod                                                                                  |
| E-mail      | Resend (a confirmar)                                                                                                                                   |
| Lint/format | **ESLint + Prettier**                                                                                                                                  |
| Testes      | Vitest                                                                                                                                                 |

### 5.3 Monorepo

```
smart-flooring-app/
  apps/
    web/        → Next.js: telas do inspetor (mobile-first), do PM e do admin
    api/        → Express em Docker: auth, regras, jobs, IA, imagens, PDF, DOCX, e-mail
  packages/
    shared/     → schemas zod e tipos (Projeto, Área, Serviço, Leitura...),
                  usados pelo web e pela api; textos de i18n
    templates/  → modelos .docx e templates de PDF
  docs/         → este documento
```

- O **mesmo schema zod** valida a saída da IA, a requisição na API e o formulário na tela.
- Na API, a lógica fica em módulos independentes do Express (`auth/`, `projetos/`, `ia/`, `documentos/`, `precos/`, `storage/`, `email/`). As rotas só validam, autorizam e chamam esses módulos.
- O schema Prisma e as migrações moram em `apps/api/prisma/`.

### 5.4 Processamento assíncrono (jobs)

```
1. Inspetor clica "Gerar"
2. web → POST /jobs { tipo: "extrair", projeto_id }
3. api grava o job (tabela jobs) e responde 202 na hora
4. um worker na api processa: Claude → dados → documentos → Storage
5. api atualiza o status → a tela recebe a novidade via SSE
```

- O celular não fica esperando. Fechar o app ou perder o sinal não perde o trabalho.
- Um job interrompido continua na tabela e é retomado.
- Tipos de job previstos: `extrair` (IA), `gerar_documentos`, `processar_imagem`, `enviar_email`, `verificar_prazos` (diário).

### 5.5 Autenticação

- **Sem cadastro aberto.** O admin convida: cria o usuário com nome, e-mail e papel, e a pessoa recebe um e-mail com link para definir a senha. Há "esqueci a senha" por e-mail.
- Senhas com hash **argon2**.
- **Access token** JWT curto (~15 min) + **refresh token** rotativo guardado (com hash) no banco, os dois em **cookies httpOnly, Secure, SameSite=Lax**. O JavaScript do navegador nunca vê o token, e dá para revogar sessões (logout, usuário desativado).
- Cookies funcionam entre web e API por estarem no **mesmo site**: em produção, subdomínios do mesmo domínio (ex.: `app.` e `api.`); em desenvolvimento, `localhost` em portas diferentes.
- Limite de tentativas no login e nas rotas de senha.

### 5.6 Hospedagem

| Parte           | Onde                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| web             | Vercel                                                                                                                                    |
| api             | Container Docker (LibreOffice para DOCX → PDF, sharp para imagens). **Provedor a decidir no primeiro deploy** (Railway, Fly.io ou Render) |
| Banco e storage | Supabase, numa **organização própria** da Smart Flooring (separada da Merge), plano Pro                                                   |

## 6. Dados (rascunho)

Postgres relacional, com `jsonb` só onde o conteúdo varia de verdade. Os nomes abaixo estão em português para leitura; **no código e no banco eles são em inglês** (D36), ex.: `projetos` → `projects`, `usuarios` → `users`.

```
usuarios          id, nome, email, senha_hash, papel (inspetor|pm|admin),
                  idioma (pt|en), ativo, criado_em
sessoes           id, usuario_id, refresh_hash, expira_em, revogada_em
tokens_convite    id, usuario_id, tipo (convite|redefinir_senha), token_hash,
                  expira_em, usado_em
clientes          id, tipo (particular|loja), nome, contato, endereço
projetos          id, cliente_id, pm_id, inspetor_id, endereco_servico,
                  etapa (novo_lead|assessment_marcado|em_venda|venda_confirmada|
                         instalacao_marcada|completo|fechado),
                  status_inspecao, responsavel_id,
                  data_assessment, data_instalacao,
                  prazo (data alvo atual), ultimo_update_em,
                  motivo_fechamento, nota_fechamento, etapa_ao_fechar, texto_original, criado_em, atualizado_em
historico         projeto_id, tipo (etapa|status_inspecao|update|atribuicao),
                  de, para, autor_id, motivo, nota, prazo, em
mensagens         id, projeto_id, autor_id, texto, foto_id, criado_em
leituras_chat     projeto_id, usuario_id, lido_ate
notificacoes      id, usuario_id, projeto_id, tipo, lida_em, criado_em
areas             id, projeto_id, nome, comprimento, largura, sq_ft,
                  piso_atual, piso_novo, observacoes
servicos          id, projeto_id, area_id, servico_id (tabela de preços),
                  descricao, quantidade, unidade,
                  preco_tabela, preco_final, alterado (bool)
materiais         id, projeto_id, area_id, servico_id, categoria,
                  tipo_material, unidade, qtd_medida, waste_pct, qtd_com_waste,
                  origem (guia|sugerido_ia|manual), observacao
guia_consumo      servico_id, tipo_material, categoria, unidade,
                  base_calculo (area|perimetro|portas|degraus|fixo),
                  consumo_por_unidade, waste_pct_padrao   (formato a confirmar)
waste_padrao      tipo_piso, instalacao (normal|diagonal|herringbone), waste_pct
medidas_area      area_id, perimetro_lf, portas, degraus  (ou colunas em areas)
leituras_umidade  id, projeto_id, area_id, subfloor, metodo, aparelho,
                  valores (jsonb), limite, resultado
fotos             id, projeto_id, area_id, caminho_storage, legenda
documentos        id, projeto_id, tipo, versao, caminho_storage, gerado_em
tabela_precos     id, servico, unidade, preco_cliente, pagamento_instalador, ativo
jobs              id, tipo, projeto_id, status, tentativas, erro, criado_em
```

- **Acesso (na API):** o PM vê os projetos com o seu `pm_id`, e o inspetor os com o seu `inspetor_id` **enquanto a inspeção não for aceita**. O admin vê todos. Isso vale também para mensagens, fotos e documentos do projeto.
- **Auth:** tabela `usuarios` (e-mail, hash da senha, papel, ativo), mais `sessoes` (hash do refresh token, expira_em, revogada_em) e `tokens_convite` (convite e redefinição de senha, com hash e validade).
- Ao ser reatribuído, o inspetor anterior **perde o acesso** ao projeto. O histórico guarda quem recusou e por quê.
- **Alertas de prazo:** uma rotina diária (na api) procura projetos com `prazo` vencido há 1 dia e notifica o PM. Nas etapas 3 e 4 sem data definida, `prazo` = `ultimo_update_em` + 3 dias.
- **Storage:** pastas por projeto, com as mesmas regras de acesso do banco.

## 7. Imagens e storage

- **Compressão no celular antes do upload**: redimensionar para ~1600px, JPEG/WebP (~300 KB por foto).
- Guardar **só a versão comprimida**. Um "salvar em alta" opcional por foto pode vir depois, se for preciso.
- Storage isolado na api atrás de uma interface (`salvarArquivo`, `lerArquivo`), o que permite trocar para Cloudflare R2 sem reescrever o resto.

### Estimativa de volume e custo

| Premissa                    | Valor                                 |
| --------------------------- | ------------------------------------- |
| Inspeções por mês           | ~330 (5 inspetores × 3/dia × 22 dias) |
| Fotos por inspeção          | ~30                                   |
| Volume por mês (comprimido) | ~3,6 GB                               |
| Volume por ano              | ~45 GB                                |

Com o plano Pro do Supabase (US$ 25/mês, 100 GB de storage incluídos), isso dá **~2 anos sem custo extra de storage**. Preços a confirmar na página oficial.

## 8. Modelos (insumo pendente)

Colocar em `modelos/` (ou `packages/templates/` quando o monorepo existir):

| Documento                  | Formato desejado                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Moisture readings          | .docx original (os marcadores `{campo}` serão propostos por nós)                      |
| Contrato                   | .docx original                                                                        |
| Orçamento, repasse, layout | Formato atual (Word, PDF ou Excel), como referência visual. Serão recriados em código |
| Tabela de preços           | Excel ou CSV (inclui preço ao cliente e pagamento ao instalador)                      |

Para cada documento, enviar também:

1. **O modelo em branco**, no formato original (não foto nem PDF escaneado).
2. **Um exemplo preenchido** real, com dados do cliente removidos.
3. **Um texto real de inspetor** descrevendo um serviço, do jeito que ele escreveria hoje.

## 9. Decisões tomadas

| #   | Decisão                                                                                                                                                                                       | Motivo                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| D1  | Postgres (Supabase) com `jsonb`, não NoSQL                                                                                                                                                    | Os dados são relacionais (usuários, status, preços, clientes) e precisam de relatórios e cruzamentos |
| D2  | Monorepo com api separada desde o início                                                                                                                                                      | Processamento pesado (imagens, PDF, DOCX, LibreOffice) não cabe em serverless                        |
| D3  | ~~Opção A~~ Substituída por D31                                                                                                                                                               |                                                                                                      |
| D4  | Supabase Storage (bucket privado, URLs assinadas pela API) com compressão no celular                                                                                                          | Custo baixo; acesso controlado pela API                                                              |
| D5  | IA gera dados, código gera documentos                                                                                                                                                         | Previsibilidade e layout fiel aos modelos                                                            |
| D6  | Interface PT/EN; documentos em inglês                                                                                                                                                         | Equipe bilíngue; clientes nos EUA                                                                    |
| D7  | PM pode alterar preço; guarda tabela e final                                                                                                                                                  | Exceções são comuns; acompanhar desvios da tabela                                                    |
| D8  | Instalador fora da plataforma                                                                                                                                                                 | Recebe só o PDF de repasse                                                                           |
| D9  | O projeto nasce com o PM (a partir do lead), que atribui um inspetor                                                                                                                          | O PM é quem tem o contato com o cliente                                                              |
| D10 | ~~Agendamento em 3 passos~~ Substituída por D19                                                                                                                                               |                                                                                                      |
| D11 | Chat por projeto, junto com os eventos do sistema numa linha do tempo                                                                                                                         | Conversa e histórico num lugar só, sem WhatsApp paralelo                                             |
| D12 | Notificações no sistema; e-mail só numa lista fixa de eventos de fluxo; chat não gera e-mail; push depois                                                                                     | Evitar excesso de e-mail; push exige PWA instalado                                                   |
| D13 | PM vê só os próprios projetos; inspetor só os atribuídos                                                                                                                                      | Nada global, exceto para o admin                                                                     |
| D14 | Inspetor pode recusar o projeto (com motivo)                                                                                                                                                  | O PM reatribui                                                                                       |
| D15 | ~~Datas possíveis opcionais~~ Substituída por D19                                                                                                                                             |                                                                                                      |
| D16 | Papel de administrador com acesso a todos os projetos                                                                                                                                         | Funções administrativas a definir depois                                                             |
| D17 | "Vendedor" passa a se chamar **project manager (PM)**                                                                                                                                         | Nome usado na empresa                                                                                |
| D18 | Etapas do projeto: novo lead → assessment marcado → em processo de venda → venda confirmada → instalação marcada → completo (+ fechado)                                                       | Visão do funil para o PM                                                                             |
| D19 | A data do assessment é decidida pelo PM, conversada com o inspetor; só o PM registra                                                                                                          | O PM é quem alimenta a plataforma                                                                    |
| D20 | Prazos são datas definidas pelo PM; etapas 3 e 4 têm padrão de 3 dias sem update; 1 dia vencido → vermelho + alerta                                                                           | Alerta, não burocracia                                                                               |
| D21 | _Atualizar projeto_ move etapas, datas e notas; _Fechar projeto_ encerra com motivo                                                                                                           | Etapas 3–6 acontecem fora da plataforma                                                              |
| D22 | O inspetor sai do projeto quando o PM aceita os documentos                                                                                                                                    | Não participa das etapas de venda                                                                    |
| D23 | Na interface, "Projeto" / "Project" (não "work order")                                                                                                                                        | Nome usado na empresa                                                                                |
| D24 | Projeto fechado pode ser reaberto, voltando à etapa em que foi fechado                                                                                                                        | Cliente que desiste e volta                                                                          |
| D25 | Motivos de fechamento numa lista fixa (+ "Outro" com texto)                                                                                                                                   | Dado comparável para relatórios                                                                      |
| D26 | O PM pode fazer o assessment e preencher o formulário; nesse caso aceita os documentos direto                                                                                                 | Projetos em que o PM vai ao local                                                                    |
| D27 | Lista de materiais gerada pelos serviços + guia de consumo; a IA traz medidas e sugestões                                                                                                     | Lista precisa e repetível                                                                            |
| D28 | Waste padrão: 10% floating/hardwood, 12% tile, 17% tile diagonal, LVP diagonal e herringbone; editável por linha                                                                              | Prática atual da Smart Flooring                                                                      |
| D29 | Lista de materiais genérica, por tipo de produto, sem quem fornece                                                                                                                            | A plataforma só precisa da lista                                                                     |
| D30 | Carpet fora do escopo por agora                                                                                                                                                               | Não é prioridade                                                                                     |
| D31 | Tudo passa pela API Express; Supabase só como Postgres + Storage, acessado pelo servidor                                                                                                      | Consequência do JWT próprio (sem Supabase Auth, sem RLS)                                             |
| D32 | Stack: Turborepo + pnpm, TypeScript, Next.js + shadcn/ui, Express, Prisma, ESLint + Prettier, Claude                                                                                          | Decidido em 20/10                                                                                    |
| D33 | JWT próprio: access curto + refresh rotativo em cookies httpOnly                                                                                                                              | Token fora do alcance do JS; sessões revogáveis                                                      |
| D34 | Usuários entram só por convite do admin, com e-mail para definir senha                                                                                                                        | Sem cadastro aberto                                                                                  |
| D35 | Provedor da API decidido no primeiro deploy                                                                                                                                                   | O Dockerfile não muda                                                                                |
| D36 | Código em inglês (nomes, arquivos, colunas, valores de enum); mensagens ao usuário em português; a API segue a estrutura do quadraon (módulos com routes → controller → service → repository) | Padrão já usado no quadraon                                                                          |
| D37 | Os dois formulários do inspetor (linha por linha e por área) ficam disponíveis, e o inspetor escolhe                                                                                          | Os dois agradaram nos protótipos                                                                     |
| D38 | Layout = rascunho à mão livre, um por área, sem medidas extraídas do desenho                                                                                                                  | Só precisa ser uma representação                                                                     |

## 10. Em aberto

- [ ] Receber os modelos e a tabela de preços (seção 8).
- [ ] Contrato: PDF via LibreOffice (a partir do .docx) ou recriado em código? Decidir ao ver o modelo.
- [x] ~~Quem atribui?~~ O PM cria o projeto e atribui o inspetor (D9).
- [x] ~~Visibilidade do PM~~ Só os próprios projetos (D13).
- [x] ~~Recusa~~ O inspetor pode recusar (D14).
- [x] ~~Datas~~ Quem decide e registra é o PM (D19).
- [x] ~~Administrador~~ Existe e vê tudo (D16).
- [x] ~~E-mail do chat~~ Não existe; e-mail só em eventos fixos (D12).
- [ ] Funções do administrador (cadastrar usuários, editar tabela de preços, reatribuir projetos de outro PM?). Não é prioridade.
- [x] ~~Repasse ao instalador~~ O PM envia por fora (D21).
- [x] ~~Nome na interface~~ "Projeto" (D23).
- [x] ~~Reabrir~~ Pode (D24).
- [x] ~~Motivos de fechamento~~ Lista fixa (D25).
- [x] ~~Waste~~ Tabela completa em 4.4 (D28); carpet fora (D30).
- [x] ~~Produto exato / quem fornece~~ Lista genérica por tipo, sem fornecedor (D29).
- [ ] **Guia de consumo de materiais** (ex.: thin-set por sq ft de tile): conteúdo e formato (tabela aplicada pelo código ou documento lido pela IA). Fica para mais adiante.
- [ ] Provedor da API (Railway, Fly.io ou Render), no primeiro deploy (D35).
- [ ] Provedor de e-mail (sugestão: Resend).
- [ ] Domínio de produção (para os subdomínios app./api. e os cookies).
