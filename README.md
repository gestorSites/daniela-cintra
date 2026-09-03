# Daniela Cintra

Site da **Daniela Cintra** (advocacia e consultoria jurídica, Franca/SP), a
partir do `template-advocacia`. Página única + `/links`.

O código não tem conteúdo: tudo vem do Supabase compartilhado, resolvido pelo
slug `daniela-cintra` e editável no painel `admin/`. Ver `../CLAUDE.md`.

**É deste repositório que o deploy sai** — e não do `template-advocacia`, que
não versiona os assets de marca. Aqui eles são versionados: `public/marca/*`,
`src/app/favicon.ico`, `icon.png` e `apple-icon.png`.

`DEFAULT_SLUG` (`src/lib/fetchContent.ts`) aponta para `daniela-cintra`, não
para o cliente de demonstração: se `NEXT_PUBLIC_CLIENT_SLUG` faltar na Vercel,
o site cai nela mesma em vez de mostrar conteúdo de outro cliente.

## Antes de publicar

`NEXT_PUBLIC_SITE_URL` precisa do domínio real, sem barra no fim. Sem ela,
`canonical` e `og:url` saem em `http://localhost:3000` e o
`scripts/check-assets.mjs` reprova. **`NEXT_PUBLIC_*` é inlinada em build:**
trocar essa env exige redeploy, nunca só restart.

Verificação pós-deploy: `node scripts/check-assets.mjs <url-real>`.

## Seções

Na ordem da home: Hero · Sobre (com os blocos de experiência) · Áreas de
atuação · Atendimento · Formação e comissões · Publicações · Galeria
(opcional) · Perguntas frequentes · Contato. Página extra `/links`.

O **Hero tem duas variantes**, escolhidas por `hero/variante`: `retrato`
(foto à direita) e `tipografica` (composição sobre a cor primária, ancorada no
logo). `retrato` sem imagem cai em `tipografica`, então o site fica
apresentável antes de existir foto. Para a tipográfica, o logo enviado precisa
ser a variante clara — ele vai sobre a primária.

Os **blocos de experiência** montam `anos` + "Experiência em {campo}" +
"Aplicada a {aplicacao}". Os rótulos são fixos e existem por conformidade:
impedem a leitura de que os anos são de advocacia. "Aplicada" concorda com
"experiência", nunca com o campo, então fecha com qualquer valor do banco.

## Conformidade (OAB)

O template segue o **Provimento 205/2021** e o **Código de Ética e Disciplina
da OAB**. Não existem — e não devem ser adicionados — componentes de
depoimento, avaliação, caso de sucesso, resultado obtido, preço, honorário,
plano, comparação com outros escritórios ou CTA de urgência.

Regras de redação da copy (inclusive dos fallbacks deste template):

- Descrever **serviço**, nunca **resultado**. Verbos permitidos: conduzo,
  elaboro, represento, acompanho, oriento, atuo. Proibidos: garanto, consigo,
  reverto, asseguro, recupero, resolvo.
- "Especialista" só onde houver especialização real; caso contrário
  "atuação em".
- Voz institucional (o escritório, o atendimento) é permitida. Nunca afirmar
  que existem outros advogados — sem seção de equipe, sem "nossa equipe
  jurídica", sem "nossos advogados".
- O número de inscrição na OAB deve aparecer no rodapé de todas as páginas.
- O **aviso do Código de Ética é constante do template**, não key de banco
  (`AVISO`, em `src/lib/content.ts`). É de propósito: o texto que sustenta a
  conformidade da página não pode ser apagado nem reescrito pelo admin. Uma
  linha `rodape/aviso` no banco é ignorada.

## Tema

Duas cores por cliente, injetadas em tempo de render por `ThemeStyle.tsx`
(uma implementação só, usada pela home e por `/links`):
`--primary`, `--secondary` e os respectivos `--on-primary` / `--on-secondary`,
calculados por luminância no momento da injeção. No Tailwind: `bg-primary`,
`text-on-primary`, `bg-secondary`, `text-on-secondary`, mais as variantes
`-soft` / `-tint` / `-strong` feitas com `color-mix()`.

**A secundária tem constante própria** (`DEFAULT_SECONDARY_RGB`) e nunca cai
na primária quando `meta/secondary_color` vem vazia — é a correção do bug que
o `template-consultorio` ainda carrega. Os valores de repouso do
`globals.css` espelham as duas constantes do `content.ts`: **mexer numa
significa mexer na outra**, senão o tema muda entre o CSS estático e o
injetado.

## Diferenças do template-consultorio (origem)

- Sem a seção "O Consultório": o `Carousel` foi generalizado como galeria
  ligada ao slot de imagem `escritorio`, sem copy própria, e não renderiza
  nada quando não há imagem.
- Sem ícones decorativos nas áreas de atuação — a diferenciação é por
  numeração e tipografia.
- Canais de contato (e-mail, telefone, endereço) só renderizam quando
  preenchidos: nada de número ou e-mail de placeholder no ar.
- Suíte de testes com Vitest (`npm test`).

## Scripts

`scripts/` guarda só ferramenta **genérica do template**:

- `check-assets.mjs <url>` — verificação pós-deploy dos assets que o crawler
  consome (favicon, ícones, og-image). Confere status, content-type e os
  primeiros bytes do corpo, porque rewrite e fallback de SPA respondem 200 com
  `text/html` e enganam teste ingênuo.

**Seed de cliente não mora aqui.** Ele carrega CNPJ, endereço, contatos e copy
de um cliente, e o template serve N — mesmo princípio que mantém a marca fora
do git daqui. Seeds de conteúdo vivem em `admin/scripts/seed-<cliente>.mjs`,
junto dos demais.

## Rodar

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_CLIENT_SLUG
npm run dev                  # http://localhost:3000
```

Demais comandos: `npm run build`, `npm run start`, `npm run lint`, `npm test`.
