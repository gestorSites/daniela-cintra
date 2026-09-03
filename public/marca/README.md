# public/marca — assets de marca do cliente

**Estes arquivos não são do template.** O `template-advocacia` serve N
clientes; a marca é de um só. Por isso o conteúdo desta pasta está no
`.gitignore` do template: só o README é versionado aqui.

No **clone do cliente** (`gestor-sites/<slug>/`, repositório próprio) os
arquivos são versionados normalmente — é lá que eles pertencem, e é de lá que
o deploy sai.

## Arquivos esperados

| arquivo | onde é usado |
|---|---|
| `simbolo-branco.svg` · `simbolo-navy.svg` | símbolo da marca (branco sobre fundo escuro, navy sobre claro) |
| `simbolo-branco-quadrado.svg` · `simbolo-navy-quadrado.svg` | versões quadradas |
| `logo-branco.svg` · `logo-navy.svg` | logo por extenso |
| `icon-512.png` | composição da og-image (`src/app/opengraph-image.tsx`) |
| `icon-192.png` | reserva |

Fora desta pasta, pela convenção do App Router — e igualmente **fora do git no
template**:

| arquivo | o que é |
|---|---|
| `src/app/favicon.ico` | ícone da aba (16/32/48) |
| `src/app/icon.png` | ícone 192 |
| `src/app/apple-icon.png` | ícone 180 (iOS) |

## Regra da variante

Branca sobre fundo escuro, navy sobre fundo claro. O hero na variante
`tipografica` desenha sobre `--primary`: o logo enviado em `images/logo` (banco)
precisa ser a **variante clara**.

## Nada aqui é obrigatório para o build

Todo consumidor degrada sem quebrar: sem `icon-512.png` a og-image sai só com
tipografia, sem os ícones o navegador usa o padrão. O template compila pelado.

## Não regerar

Os arquivos vêm prontos e tratados. Não reescalar para cima nem reexportar.
