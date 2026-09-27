# La Encasa — Cardápio digital

Site e cardápio digital da **La Encasa Burguer** (Franca-SP). O cliente monta o pedido, informa entrega ou retirada e pagamento, e o site abre o WhatsApp da loja com a mensagem pronta.

Feito com Next.js, TypeScript e Tailwind CSS. Não tem login, banco de dados nem pagamento online. O carrinho fica salvo no navegador (localStorage).

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Onde editar

| O que | Arquivo |
| --- | --- |
| Produtos, preços, ingredientes, adicionais, combos | `data/menu.ts` |
| Horário de funcionamento, taxa de entrega, WhatsApp, endereço, texto "Sobre" | `data/site.ts` |
| Fotos dos produtos | `public/images/produtos/` (e o campo `image` em `data/menu.ts`) |

Exemplos rápidos:

- **Esgotar um item:** em `data/menu.ts`, adicione `available: false` ao produto.
- **Mudar preço:** altere `price` (ou o valor em `inteira`/`meia` nas porções).
- **Destacar em "Os favoritos da casa":** `featured: true` (o ideal é que tenha foto).
- **Taxa de entrega:** em `data/site.ts`, `deliveryFee: 5` (ou `null` para "a combinar").
- **Horários:** em `data/site.ts`, objeto `hours` (0 = domingo … 6 = sábado). O selo "Aberto agora / Fechado agora" usa esses horários, no fuso de Brasília.

## Fotos

Para trocar ou adicionar fotos, coloque os arquivos `.jpg` em `public/images/produtos/` e aponte o `image` do produto. O `next/image` já entrega AVIF/WebP no tamanho certo. O script `npm run images` regenera as imagens a partir das fotos originais na pasta Downloads (veja `scripts/optimize-images.mjs`).

## Publicar

O site está na **Vercel** (https://laencasacardapio.vercel.app), ligada a este repositório do GitHub. A cada `git push` na branch `main`, a Vercel publica a nova versão sozinha em 1–2 minutos:

```bash
git add -A
git commit -m "Descreva a alteração"
git push
```
