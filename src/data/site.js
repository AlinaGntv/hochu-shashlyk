// Весь контент сайта лежит здесь — тексты, цены, контакты, фото.
// Фото: положите файл (.jpg, .jpeg, .png или .webp) в src/assets/photos с именем,
// которое указано у блюда, например photo: p('pork-neck') → pork-neck.jpg.
// Пока файла с таким именем нет, на сайте показывается заглушка.

const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop().replace(/\.\w+$/, ''), url]),
)
const p = (name) => byName[name] ?? null

export const site = {
  name: 'Хочу Шашлык',
  tagline: 'Быстрое питание',
  address: 'ш. Энтузиастов, 36А, Балашиха',
  hours: 'Ежедневно, 10:00–23:00',
  phone: '+7 (992) 555-22-55',
  phoneHref: 'tel:+79925552255',
  mapUrl: 'https://yandex.ru/maps/?text=Балашиха, шоссе Энтузиастов, 36А',
  socials: [
    { id: 'vk', label: 'ВКонтакте', url: '#' },
    { id: 'telegram', label: 'Telegram', url: '#' },
    { id: 'instagram', label: 'Instagram', url: '#' },
  ],
}

export const nav = [
  { label: 'Меню', href: '/menu.html' },
  { label: 'О нас', href: '/#about' },
  { label: 'Акции', href: '/#sets' },
  { label: 'Контакты', href: '/#contacts' },
]

// Слайды первого экрана. Первый — из макета, остальные три — заглушки.
export const heroSlides = [
  {
    tag: 'Настоящий',
    title: 'Шашлык',
    price: 'от 400 ₽',
    text: 'Сочное мясо, маринованное по фирменному рецепту и приготовленное на углях',
    weight: '300 г',
    photo: p('hero-shashlik'),
  },
  {
    tag: 'Сочный',
    title: 'Люля',
    price: 'от 350 ₽',
    text: 'Рубленое мясо со специями и зеленью, с дымком прямо с мангала',
    weight: '250 г',
    photo: p('hero-lula'),
  },
  {
    tag: 'С углей',
    title: 'Рыба',
    price: 'от 690 ₽',
    text: 'Нежная рыба на решётке с лимоном и ароматом дыма',
    weight: '300 г',
    photo: p('hero-fish'),
  },
  {
    tag: 'Горячая',
    title: 'Шаурма',
    price: 'от 280 ₽',
    text: 'Классическая в лаваше с мясом с углей и фирменным соусом',
    weight: '350 г',
    photo: p('hero-shawarma'),
  },
]

// badge: 'hit' | 'new' | undefined
// «Новинки» — из макета, остальные категории пока заполнены заглушками.
export const menu = [
  {
    id: 'new',
    title: 'Новинки',
    items: [
      { name: 'Свиная шея', text: 'Сочный шашлык на углях', price: 420, weight: '300 г', badge: 'hit', photo: p('pork-neck') },
      { name: 'Сёмга на углях', text: 'Нежная рыба с ароматом дымка', price: 1150, weight: '300 г', badge: 'new', photo: p('salmon') },
      { name: 'Шаурма куриная', text: 'Классическая в лаваше с фирменным соусом', price: 280, weight: '350 г', photo: p('shawarma-chicken') },
      { name: 'Люля из баранины', text: 'Рубленое мясо со специями', price: 390, weight: '250 г', badge: 'new', photo: p('lula-lamb') },
      { name: 'Куриные крылья', text: 'В остром маринаде на решётке', price: 350, weight: '300 г', photo: p('wings') },
      { name: 'Овощи гриль', text: 'Перец, кабачок, томаты, шампиньоны', price: 250, weight: '250 г', photo: p('vegetables') },
    ],
  },
  {
    id: 'shashlik',
    title: 'Шашлык',
    items: [
      { name: 'Свиная шея', text: 'Сочный шашлык на углях', price: 420, weight: '300 г', badge: 'hit', photo: p('pork-neck') },
      { name: 'Куриное бедро', text: 'Мягкое мясо в пряном маринаде', price: 400, weight: '300 г', photo: p('chicken') },
      { name: 'Баранина', text: 'Мякоть на шампуре с луком', price: 650, weight: '300 г', photo: p('lamb') },
    ],
  },
  {
    id: 'lula',
    title: 'Люля-кебаб',
    items: [
      { name: 'Люля из баранины', text: 'Рубленое мясо со специями', price: 390, weight: '250 г', photo: p('lula-lamb') },
      { name: 'Люля из курицы', text: 'Нежный кебаб с зеленью', price: 350, weight: '250 г', photo: p('lula-chicken') },
      { name: 'Люля из говядины', text: 'Плотный и сочный, с дымком', price: 420, weight: '250 г', photo: p('lula-beef') },
    ],
  },
  {
    id: 'fish',
    title: 'Рыба',
    items: [
      { name: 'Сёмга на углях', text: 'Нежная рыба с ароматом дымка', price: 1150, weight: '300 г', badge: 'new', photo: p('salmon') },
      { name: 'Форель', text: 'Целая рыба на решётке с лимоном', price: 890, weight: '350 г', photo: p('trout') },
      { name: 'Скумбрия', text: 'Жирная рыба с хрустящей кожей', price: 690, weight: '300 г', photo: p('mackerel') },
    ],
  },
  {
    id: 'shaurma',
    title: 'Шаурма и доги',
    items: [
      { name: 'Шаурма куриная', text: 'Классическая в лаваше с фирменным соусом', price: 280, weight: '350 г', photo: p('shawarma-chicken') },
      { name: 'Шаурма со свининой', text: 'Мясо с углей, овощи, соус', price: 320, weight: '350 г', photo: p('shawarma-pork') },
      { name: 'Хот-дог', text: 'Колбаска гриль, соленья, горчица', price: 250, weight: '220 г', photo: p('hotdog') },
    ],
  },
  {
    id: 'sides',
    title: 'Гарниры',
    items: [
      { name: 'Овощи гриль', text: 'Перец, кабачок, томаты, шампиньоны', price: 250, weight: '250 г', photo: p('vegetables') },
      { name: 'Картофель на углях', text: 'С чесноком и зеленью', price: 200, weight: '250 г', photo: p('potato') },
      { name: 'Маринованный лук', text: 'Хрустящий, к любому мясу', price: 80, weight: '100 г', photo: p('onion') },
    ],
  },
  {
    id: 'bakery',
    title: 'Выпечка',
    items: [
      { name: 'Лаваш', text: 'Тонкий, свежий', price: 50, weight: '100 г', photo: p('lavash') },
      { name: 'Лепёшка', text: 'Горячая, из тандыра', price: 70, weight: '200 г', photo: p('lepeshka') },
      { name: 'Хачапури', text: 'С сыром сулугуни', price: 350, weight: '300 г', photo: p('khachapuri') },
    ],
  },
]

export const promo = {
  title: 'Ассорти',
  accent: 'на компанию',
  text: 'Большие мясные наборы для отдыха, семьи и друзей.',
  button: 'Выбрать набор',
  badge: ['от 4', 'до 14', 'персон'],
  photo: p('platter'),
}

export const features = [
  { icon: 'flame', text: 'Готовим на углях' },
  { icon: 'leaf', text: 'Отборное мясо и рыба' },
  { icon: 'people', text: 'Для любой компании' },
  { icon: 'bag', text: 'Быстрый заказ и самовывоз' },
]
