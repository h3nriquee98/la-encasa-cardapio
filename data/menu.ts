// Cardápio da La Encasa — transcrito do cardápio impresso da loja.
//
// Para editar: altere nome, preço, ingredientes ou `available: false` para esgotar um item.
// Os componentes leem tudo daqui; não é preciso mexer no resto do site.
//
// FOTOS: só existem fotos reais de 8 lanches. Elas foram associadas pelo que aparece
// na foto (ingredientes visíveis) — confira se cada foto corresponde ao lanche certo.
// Produtos sem `image` mostram uma ilustração no lugar da foto.

export type CategoryId =
  | "artesanais"
  | "tradicionais"
  | "combos"
  | "porcoes"
  | "bebidas"
  | "cervejas";

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string; // usado na mensagem do WhatsApp
  note?: string;
}

export interface OptionChoice {
  id: string;
  label: string;
  /** Substitui o preço base do produto (ex.: meia porção). */
  price?: number;
  /** Soma ao preço base. */
  extra?: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  required: boolean;
  choices: OptionChoice[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  group: "Complementos" | "Carnes" | "Empanados" | "Molhos e sachês";
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: CategoryId;
  ingredients: string[];
  options?: OptionGroup[];
  addons?: Addon[];
  /** Ingredientes que o cliente pode pedir para tirar. */
  removable?: string[];
  featured?: boolean;
  available: boolean;
  badge?: string;
  /** Dica exibida no campo de observação (ex.: qual sabor). */
  notePlaceholder?: string;
}

export const categories: Category[] = [
  { id: "artesanais", name: "Artesanais", emoji: "🍔" },
  { id: "tradicionais", name: "Tradicionais", emoji: "🍔" },
  { id: "combos", name: "Combos", emoji: "⭐", note: "Nos combos não trocamos os produtos e não colocamos adicionais." },
  { id: "porcoes", name: "Porções", emoji: "🍟" },
  { id: "bebidas", name: "Bebidas", emoji: "🥤" },
  { id: "cervejas", name: "Cervejas", emoji: "🍺", note: "Venda proibida para menores de 18 anos." },
];

// ---------------------------------------------------------------------------
// Adicionais dos lanches
// ---------------------------------------------------------------------------

export const addons: Addon[] = [
  { id: "salada", name: "Salada (alface, tomate e cebola)", price: 3, group: "Complementos" },
  { id: "bacon", name: "Bacon", price: 5, group: "Complementos" },
  { id: "ovo", name: "Ovo", price: 3, group: "Complementos" },
  { id: "mucarela", name: "Muçarela", price: 5, group: "Complementos" },
  { id: "requeijao-cremoso", name: "Requeijão cremoso", price: 4, group: "Complementos" },
  { id: "cheddar-cremoso", name: "Cheddar cremoso", price: 4, group: "Complementos" },
  { id: "cheddar-fatias", name: "Cheddar em fatias", price: 5, group: "Complementos" },
  { id: "presunto", name: "Presunto", price: 4, group: "Complementos" },
  { id: "cebola-empanada", name: "Cebola empanada (3 unid.)", price: 4, group: "Complementos" },
  { id: "hamburguer-artesanal", name: "Hambúrguer artesanal 170 g", price: 10, group: "Carnes" },
  { id: "hamburguer-tradicional", name: "Hambúrguer tradicional 100 g", price: 7, group: "Carnes" },
  { id: "hamburguer-vegetariano", name: "Hambúrguer vegetariano 140 g", price: 7, group: "Carnes" },
  { id: "file-frango", name: "Filé de frango grelhado 150 g", price: 7, group: "Carnes" },
  { id: "costela", name: "Costela assada 80 g", price: 9, group: "Carnes" },
  { id: "frango-empanado", name: "Frango empanado e frito 140 g", price: 9, group: "Carnes" },
  { id: "requeijao-empanado", name: "Requeijão empanado", price: 7, group: "Empanados" },
  { id: "cheddar-empanado", name: "Cheddar empanado", price: 7, group: "Empanados" },
  { id: "provolone-empanado", name: "Provolone empanado", price: 8, group: "Empanados" },
  { id: "mucarela-empanada", name: "Muçarela empanada", price: 7, group: "Empanados" },
  { id: "empanado-2-queijos", name: "Empanado de 2 queijos (muçarela e requeijão)", price: 8, group: "Empanados" },
  { id: "molho-casa", name: "Molho da casa", price: 2, group: "Molhos e sachês" },
  { id: "saches-maionese", name: "Sachês de maionese (4 unid.)", price: 1, group: "Molhos e sachês" },
  { id: "saches-catchup", name: "Sachês de catchup (4 unid.)", price: 1, group: "Molhos e sachês" },
];

// O hambúrguer artesanal extra só pode ser adicionado nos lanches artesanais.
const artesanalAddons = addons;
const tradicionalAddons = addons.filter((a) => a.id !== "hamburguer-artesanal");

// Itens que não fazem sentido remover (a base do lanche).
const FIXED = /hamb[uú]rguer|frango|fil[eé]|picanha|costela|brioche|empanad[oa] \d|empanado de|empanada$|^\d/i;
const removableFrom = (ingredients: string[]) =>
  ingredients.filter((i) => !FIXED.test(i) || /^cebola/i.test(i));

type BurgerInput = Omit<Product, "category" | "addons" | "removable" | "available"> &
  Partial<Pick<Product, "available">>;

const artesanal = (p: BurgerInput): Product => ({
  available: true,
  ...p,
  category: "artesanais",
  addons: artesanalAddons,
  removable: removableFrom(p.ingredients),
});

const tradicional = (p: BurgerInput): Product => ({
  available: true,
  ...p,
  category: "tradicionais",
  addons: tradicionalAddons,
  removable: removableFrom(p.ingredients),
});

// ---------------------------------------------------------------------------
// Hambúrgueres artesanais
// ---------------------------------------------------------------------------

const artesanais: Product[] = [
  artesanal({
    id: "empanado-do-chef",
    name: "Empanado do Chef",
    price: 36,
    badge: "Lançamento",
    image: "/images/produtos/empanado-do-chef.jpg",
    featured: true,
    ingredients: ["Frango empanado e frito 140 g", "Queijo cheddar", "Requeijão", "Bacon", "Alface", "Tomate", "Cebola caramelizada"],
  }),
  artesanal({
    id: "imperador",
    name: "Imperador",
    price: 39,
    image: "/images/produtos/imperador.jpg",
    featured: true,
    ingredients: ["Hambúrguer artesanal 170 g", "Requeijão empanado 100 g", "Cheddar", "Bacon artesanal", "Molho barbecue", "Cebola caramelizada", "Alface", "Tomate"],
  }),
  artesanal({
    id: "turbinadao",
    name: "Turbinadão",
    price: 50,
    image: "/images/produtos/turbinadao.jpg",
    featured: true,
    ingredients: ["2 hambúrgueres artesanais 170 g", "2 ovos", "Bacon artesanal", "Presunto", "Muçarela", "Provolone", "Cheddar", "Requeijão", "Alface", "Tomate", "Cebola roxa", "Cebola caramelizada", "Molho barbecue"],
  }),
  artesanal({
    id: "duplo-cheddar",
    name: "Duplo Cheddar",
    price: 43,
    image: "/images/produtos/duplo-cheddar.jpg",
    featured: true,
    ingredients: ["2 hambúrgueres artesanais 170 g", "Queijo cheddar", "Presunto", "Bacon artesanal", "Ovo", "Requeijão", "Tomate", "Alface", "Cebola roxa"],
  }),
  artesanal({
    id: "magnifico",
    name: "Magnífico",
    price: 41,
    image: "/images/produtos/magnifico.jpg",
    featured: true,
    ingredients: ["Hambúrguer 170 g", "Provolone empanado 100 g", "Cheddar", "Bacon", "Cebola caramelizada", "Alface", "Tomate"],
  }),
  artesanal({
    id: "fabuloso",
    name: "Fabuloso",
    price: 40,
    image: "/images/produtos/fabuloso.jpg",
    featured: true,
    ingredients: ["Hambúrguer artesanal 170 g", "Empanado de 2 queijos (muçarela e requeijão)", "Muçarela", "Bacon artesanal", "Molho barbecue", "Alface", "Tomate", "Cebola caramelizada"],
  }),
  artesanal({
    id: "prime",
    name: "Prime",
    price: 39,
    image: "/images/produtos/prime.jpg",
    ingredients: ["Hambúrguer artesanal 170 g", "Muçarela empanada", "Cheddar", "Bacon", "Tomate", "Alface", "Cebola roxa"],
  }),
  artesanal({
    id: "classico-artesanal",
    name: "Clássico Artesanal",
    price: 38,
    image: "/images/produtos/classico-artesanal.jpg",
    ingredients: ["Hambúrguer artesanal 170 g", "Muçarela", "Presunto", "Bacon", "Ovo", "Requeijão", "Tomate", "Alface", "Cebola roxa"],
  }),
  artesanal({
    id: "super-croc",
    name: "Super Croc",
    price: 36,
    badge: "Lançamento",
    ingredients: ["Frango empanado e frito 140 g", "Muçarela", "Requeijão", "Bacon", "Alface", "Tomate", "Cebola roxa"],
  }),
  artesanal({
    id: "soberano",
    name: "Soberano",
    price: 41,
    ingredients: ["Hambúrguer 170 g", "Costela assada 80 g", "Muçarela em dobro", "Alface", "Tomate", "Cebola roxa"],
  }),
  artesanal({
    id: "picanha-burguer",
    name: "Picanha Burguer",
    price: 39,
    ingredients: ["Hambúrguer artesanal 170 g", "Filetes de picanha", "Bacon artesanal", "Queijo cheddar", "Cebola caramelizada", "Molho barbecue"],
  }),
  artesanal({
    id: "master-cheddar",
    name: "Master Cheddar",
    price: 39,
    ingredients: ["Hambúrguer artesanal 170 g", "Cheddar empanado 100 g", "Cheddar", "Bacon artesanal", "Cebola caramelizada", "Molho barbecue"],
  }),
  artesanal({
    id: "picanha-super",
    name: "Picanha Super",
    price: 39,
    ingredients: ["Hambúrguer artesanal 170 g", "Filetes de picanha", "Muçarela", "Queijo cheddar", "Tomate", "Alface", "Cebola caramelizada", "Cebola roxa", "Molho barbecue"],
  }),
  artesanal({
    id: "grand-file",
    name: "Grand Filé",
    price: 38,
    ingredients: ["Pão brioche", "Contra filé", "Muçarela em dobro", "Alface", "Tomate", "Cebola roxa"],
  }),
  artesanal({
    id: "a-moda-do-chef",
    name: "A Moda do Chef",
    price: 36,
    ingredients: ["Hambúrguer artesanal 170 g", "Queijo cheddar", "Requeijão", "Bacon artesanal", "Cebola caramelizada", "Alface", "Tomate", "Molho barbecue"],
  }),
  artesanal({
    id: "la-encasa",
    name: "La Encasa",
    price: 34,
    ingredients: ["Hambúrguer artesanal 170 g", "Queijo cheddar", "Ovo", "Alface", "Tomate", "Cebola roxa"],
  }),
  artesanal({
    id: "big-frango",
    name: "Big Frango",
    price: 33,
    ingredients: ["Filé de frango grelhado 150 g", "Queijo cheddar", "Bacon artesanal", "Alface", "Tomate", "Cebola caramelizada"],
  }),
  artesanal({
    id: "moderado",
    name: "Moderado",
    price: 31,
    ingredients: ["Hambúrguer artesanal 170 g", "Queijo cheddar", "Requeijão", "Cebola roxa", "Molho barbecue"],
  }),
  artesanal({
    id: "vegetariano",
    name: "Vegetariano",
    price: 28,
    ingredients: ["Hambúrguer vegetal gourmet 100 g", "Muçarela", "Alface", "Tomate", "Cebola roxa"],
  }),
  artesanal({
    id: "cheese-burguer-artesanal",
    name: "Cheese Burguer Artesanal",
    price: 27,
    ingredients: ["Hambúrguer 170 g", "Cheddar"],
  }),
];

// ---------------------------------------------------------------------------
// Hambúrgueres tradicionais
// ---------------------------------------------------------------------------

const tradicionais: Product[] = [
  tradicional({ id: "cheese-burguer", name: "Cheese Burguer", price: 20, ingredients: ["Hambúrguer 100 g", "Queijo muçarela"] }),
  tradicional({ id: "salada", name: "Salada", price: 23, ingredients: ["Hambúrguer 100 g", "Queijo muçarela", "Tomate", "Alface", "Cebola roxa"] }),
  tradicional({ id: "egg", name: "Egg", price: 24, ingredients: ["Hambúrguer 100 g", "Queijo muçarela", "Ovo", "Tomate", "Alface", "Cebola roxa"] }),
  tradicional({ id: "bacon", name: "Bacon", price: 24, ingredients: ["Hambúrguer 100 g", "Queijo muçarela", "Bacon", "Tomate", "Alface", "Cebola roxa"] }),
  tradicional({ id: "frango-mais", name: "Frango Mais", price: 25, ingredients: ["Filé de frango grelhado 150 g", "Queijo muçarela", "Bacon", "Ovo", "Requeijão"] }),
  tradicional({ id: "point", name: "Point", price: 26, ingredients: ["2 hambúrgueres 100 g", "Queijo muçarela", "Presunto", "Bacon", "Ovo"] }),
  tradicional({ id: "classico", name: "Clássico", price: 28, ingredients: ["2 hambúrgueres 100 g", "Muçarela", "Presunto", "Bacon", "Ovo", "Requeijão", "Tomate", "Alface", "Cebola roxa"] }),
  tradicional({ id: "frango-super", name: "Frango Super", price: 28, ingredients: ["Filé de frango grelhado 150 g", "Muçarela", "Bacon", "Requeijão", "Alface", "Tomate", "Cebola empanada"] }),
  tradicional({ id: "supremo", name: "Supremo", price: 30, ingredients: ["2 hambúrgueres 100 g", "Muçarela", "Presunto", "Bacon", "Ovo", "Requeijão", "Tomate", "Alface", "Cebola empanada"] }),
  tradicional({ id: "maximus", name: "Máximus", price: 32, ingredients: ["2 hambúrgueres 100 g", "Muçarela empanada", "Bacon", "Ovo", "Requeijão", "Tomate", "Alface", "Cebola roxa"] }),
  tradicional({ id: "avalanche", name: "Avalanche", price: 36, ingredients: ["4 hambúrgueres 100 g", "Muçarela", "Cheddar", "Presunto", "Bacon", "Ovo", "Requeijão", "Tomate", "Alface", "Cebola roxa"] }),
];

// ---------------------------------------------------------------------------
// Combos
// ---------------------------------------------------------------------------

// O cardápio diz "exceto Clássico, Duplo Cheddar e Turbinadão". Ajuste a lista se precisar.
const COMBO_ESPECIAL_EXCLUDED = ["classico", "classico-artesanal", "duplo-cheddar", "turbinadao"];

const comboChoices: OptionChoice[] = [...artesanais, ...tradicionais]
  .filter((p) => !COMBO_ESPECIAL_EXCLUDED.includes(p.id))
  .map((p) => ({ id: p.id, label: p.name }));

const combos: Product[] = [
  {
    id: "combo-la-encasa",
    name: "Combo La Encasa",
    category: "combos",
    price: 85,
    description: "2 lanches La Encasa + batata média cheddar e bacon + Guaraná Antarctica 1 l.",
    ingredients: ["2 lanches La Encasa", "Batata média cheddar e bacon", "Guaraná Antarctica 1 l"],
    available: true,
  },
  {
    id: "combo-especial",
    name: "Combo Especial",
    category: "combos",
    price: 95,
    description:
      "2 lanches à sua escolha (exceto Clássico, Duplo Cheddar e Turbinadão) + batata média cheddar e bacon + Guaraná Antarctica 1 l.",
    ingredients: ["2 lanches à escolha", "Batata média cheddar e bacon", "Guaraná Antarctica 1 l"],
    options: [
      { id: "lanche-1", title: "1º lanche", required: true, choices: comboChoices },
      { id: "lanche-2", title: "2º lanche", required: true, choices: comboChoices },
    ],
    available: true,
  },
];

// ---------------------------------------------------------------------------
// Porções
// ---------------------------------------------------------------------------

const size = (inteira: [string, number], meia?: [string, number]): OptionGroup[] | undefined =>
  meia
    ? [
        {
          id: "tamanho",
          title: "Tamanho",
          required: true,
          choices: [
            { id: "inteira", label: `Inteira (${inteira[0]})`, price: inteira[1] },
            { id: "meia", label: `Meia (${meia[0]})`, price: meia[1] },
          ],
        },
      ]
    : undefined;

const porcao = (
  p: Omit<Product, "category" | "available" | "options" | "price" | "ingredients"> & {
    inteira: [string, number];
    meia?: [string, number];
    ingredients?: string[];
    options?: OptionGroup[];
  },
): Product => {
  const { inteira, meia, options = [], ingredients = [], ...rest } = p;
  return {
    ...rest,
    category: "porcoes",
    price: inteira[1],
    ingredients,
    options: [...(size(inteira, meia) ?? []), ...options],
    available: true,
  };
};

const porcoes: Product[] = [
  porcao({ id: "batata-simples", name: "Batata simples", inteira: ["400 g", 26], meia: ["200 g", 15] }),
  porcao({ id: "batata-cheddar-bacon", name: "Batata cheddar e bacon", inteira: ["600 g", 36], meia: ["300 g", 27] }),
  porcao({ id: "batata-requeijao-bacon", name: "Batata requeijão e bacon", inteira: ["600 g", 36], meia: ["300 g", 27] }),
  porcao({ id: "batata-bacon-mucarela", name: "Batata bacon e muçarela", inteira: ["600 g", 38], meia: ["300 g", 28] }),
  porcao({
    id: "batata-la-encasa",
    name: "Batata La Encasa",
    description: "Fritas, requeijão e hambúrguer coberto com muçarela.",
    ingredients: ["Batata frita", "Requeijão", "Hambúrguer", "Muçarela"],
    inteira: ["600 g", 42],
    meia: ["300 g", 31],
  }),
  porcao({
    id: "batata-gaucha",
    name: "Batata Gaúcha",
    description: "Fritas, requeijão e costela assada. 600 g.",
    ingredients: ["Batata frita", "Requeijão", "Costela assada"],
    inteira: ["600 g", 47],
  }),
  porcao({ id: "aneis-cebola", name: "Anéis de cebola empanada", inteira: ["24 unid.", 27], meia: ["12 unid.", 20] }),
  porcao({
    id: "bolinhos",
    name: "Bolinhos",
    inteira: ["500 g", 32],
    meia: ["250 g", 22],
    options: [
      {
        id: "sabor",
        title: "Sabor",
        required: true,
        choices: [
          { id: "carne-seca", label: "Carne seca" },
          { id: "mandioqueijo", label: "Mandioqueijo" },
          { id: "costela", label: "Costela" },
          { id: "bacalhau", label: "Bacalhau" },
          { id: "tilapia-queijo", label: "Tilápia com queijo" },
        ],
      },
    ],
  }),
  porcao({ id: "quibe-queijo", name: "Quibe com queijo", inteira: ["500 g", 27], meia: ["250 g", 20] }),
  porcao({ id: "mini-coxinha", name: "Mini coxinha cremosa", inteira: ["500 g", 27], meia: ["250 g", 20] }),
  porcao({ id: "frango-empanado", name: "Frango empanado", inteira: ["500 g", 27], meia: ["250 g", 20] }),
  porcao({
    id: "contra-file",
    name: "Porção de contra filé",
    description: "450 g de contra filé. Acompanha batata frita e cebola empanada.",
    ingredients: ["Contra filé 450 g", "Batata frita", "Cebola empanada"],
    inteira: ["450 g", 65],
  }),
  porcao({ id: "torresmo-rolo", name: "Torresmo em rolo", description: "500 g.", inteira: ["500 g", 39] }),
];

// ---------------------------------------------------------------------------
// Bebidas e cervejas
// ---------------------------------------------------------------------------

const drink = (
  category: "bebidas" | "cervejas",
  id: string,
  name: string,
  price: number,
  extra: Partial<Product> = {},
): Product => ({ id, name, price, category, ingredients: [], available: true, ...extra });

const choice = (title: string, labels: string[]): OptionGroup[] => [
  {
    id: "escolha",
    title,
    required: true,
    choices: labels.map((label) => ({ id: label.toLowerCase().replace(/\s+/g, "-"), label })),
  },
];

const bebidas: Product[] = [
  drink("bebidas", "refri-lata", "Refrigerante lata", 6, {
    description: "Sabores variados.",
    notePlaceholder: "Qual sabor? Ex.: Coca-Cola, Guaraná…",
  }),
  drink("bebidas", "refri-1l", "Refrigerante 1 l", 9, {
    description: "Sabores variados.",
    notePlaceholder: "Qual sabor?",
  }),
  drink("bebidas", "coca-1l", "Coca-Cola 1 l", 10),
  drink("bebidas", "refri-2l", "Refrigerante 2 l", 14, {
    description: "Sabores variados.",
    notePlaceholder: "Qual sabor?",
  }),
  drink("bebidas", "limoneto-schweppes", "Limoneto ou Schweppes 1,5 l", 12, {
    options: choice("Escolha", ["Limoneto", "Schweppes"]),
  }),
  drink("bebidas", "h2o", "H2O 500 ml", 7, { options: choice("Sabor", ["Limão", "Limoneto"]) }),
  drink("bebidas", "suco-prats", "Suco Prats 900 ml", 18, {
    description: "Sabores variados.",
    notePlaceholder: "Qual sabor?",
  }),
  drink("bebidas", "suco-prats-uva", "Suco Prats Uva 900 ml", 23),
  drink("bebidas", "agua", "Água 500 ml", 4),
];

const cervejas: Product[] = [
  drink("cervejas", "heineken-600", "Heineken 600 ml", 15),
  drink("cervejas", "corona-600", "Corona 600 ml", 15),
  drink("cervejas", "colorado-600", "Colorado 600 ml", 18),
  drink("cervejas", "stella-600", "Stella 600 ml", 14),
  drink("cervejas", "spaten-600", "Spaten 600 ml", 14),
  drink("cervejas", "budweiser-600", "Budweiser 600 ml", 14),
  drink("cervejas", "original-600", "Original 600 ml", 12),
  drink("cervejas", "antarctica-600", "Antarctica 600 ml", 11),
  drink("cervejas", "brahma-600", "Brahma 600 ml", 11),
  drink("cervejas", "long-neck", "Long neck", 9, {
    options: choice("Cerveja", ["Heineken", "Stella", "Budweiser"]),
  }),
  drink("cervejas", "cerveja-lata", "Cerveja lata", 6, {
    options: choice("Cerveja", ["Amstel", "Antarctica", "Brahma", "Original"]),
  }),
];

export const products: Product[] = [
  ...artesanais,
  ...tradicionais,
  ...combos,
  ...porcoes,
  ...bebidas,
  ...cervejas,
];

export const featuredProducts = products.filter((p) => p.featured && p.available);

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
