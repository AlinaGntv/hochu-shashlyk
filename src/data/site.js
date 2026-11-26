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
  reviewsUrl: 'https://yandex.ru/maps/?text=Хочу%20шашлык%2C%20шоссе%20Энтузиастов%2C%2036А%2C%20Балашиха',
  socials: [
    { id: 'vk', label: 'ВКонтакте', url: '#' },
    { id: 'telegram', label: 'Telegram', url: '#' },
    { id: 'instagram', label: 'Instagram', url: '#' },
  ],
}

export const nav = [
  { label: 'Меню', href: '/menu' },
  { label: 'О нас', href: '/about' },
  { label: 'Акции', href: '/promo' },
  { label: 'Контакты', href: '/contacts' },
]

// Слайды первого экрана показывают позиции из актуального меню.
export const heroSlides = [
  {
    tag: 'Настоящий',
    title: 'Шашлык',
    price: 'от 120 ₽',
    text: 'Птица, телятина, свинина и баранина на мангале',
    weight: 'за 100 г',
    photo: p('hero-shashlik'),
  },
  {
    tag: 'Сочный',
    title: 'Люля',
    price: 'от 300 ₽',
    text: 'Куриный, говяжий, бараний и свиной',
    weight: '250 г',
    photo: p('hero-lula'),
  },
  {
    tag: 'С углей',
    title: 'Рыба',
    price: 'от 170 ₽',
    text: 'Скумбрия, дорадо, сибас, сёмга и форель',
    weight: 'за 100 г',
    photo: p('hero-fish'),
  },
  {
    tag: 'На компанию',
    title: 'Ассорти',
    price: 'от 4 050 ₽',
    text: 'Наборы от шефа для больших компаний',
    weight: 'общий вес от 3,3 кг',
    photo: p('platter'),
  },
]

// Каталог и цены из актуального меню. Вес для мясных и рыбных позиций указан в сыром виде.
const dish = (id, name, weight, price, text, photo = null) => ({ id, name, weight, price, text, photo })

export const menu = [
  {
    id: 'fish',
    title: 'Рыба на мангале',
    items: [
      dish('fish-mackerel', 'Скумбрия', '100 г', 170, 'На мангале', p('mackerel')),
      dish('fish-dorado', 'Дорадо', '100 г', 270, 'На мангале'),
      dish('fish-seabass', 'Сибас', '100 г', 270, 'На мангале'),
      dish('fish-salmon', 'Сёмга', '100 г', 450, 'На мангале', p('salmon')),
      dish('fish-trout', 'Форель', '100 г', 260, 'На мангале', p('trout')),
    ],
  },
  {
    id: 'sides',
    title: 'Овощи и гарниры',
    items: [
      dish('side-potato', 'Картофель гриль', '200 г', 200, 'На мангале', p('potato')),
      dish('side-grilled-vegetables', 'Овощи гриль', '200 г', 280, 'На мангале', p('vegetables')),
      dish('side-mushrooms', 'Шампиньоны гриль', '200 г', 290, 'На мангале'),
      dish('side-vegetable-set', 'Овощи (баклажан, перец, помидор)', '—', 450, 'По 1 шт. каждого овоща'),
      dish('side-suluguni', 'Сулугуни на углях', '250 г', 350, 'На углях'),
    ],
  },
  {
    id: 'grill',
    title: 'Птица и мясо на мангале',
    items: [
      dish('grill-chicken-wings', 'Куриные крылья', '300 г', 300, 'На мангале', p('wings')),
      dish('grill-chicken-breast', 'Куриная грудка', '300 г', 420, 'На мангале', p('chicken')),
      dish('grill-chicken-thigh', 'Куриное бедро', '100 г', 120, 'На мангале', p('chicken')),
      dish('grill-turkey', 'Индейка', '300 г', 580, 'На мангале'),
      dish('grill-veal', 'Телятина', '100 г', 280, 'На мангале'),
      dish('grill-pork-neck', 'Свиная шея', '300 г', 480, 'На мангале', p('pork-neck')),
      dish('grill-pork-ribs', 'Свиные рёбра', '300 г', 420, 'На мангале'),
      dish('grill-pork-loin', 'Свиная корейка', '100 г', 140, 'На мангале'),
      dish('grill-lamb-loin', 'Баранья корейка', '300 г', 900, 'На мангале'),
      dish('grill-lamb-pulp', 'Баранья мякоть', '300 г', 800, 'На мангале', p('lamb')),
      dish('grill-lamb-ribs', 'Бараньи семечки', '300 г', 720, 'На мангале'),
      dish('grill-liver-fat-tail', 'Печень курдюк', '300 г', 380, 'На мангале'),
    ],
  },
  {
    id: 'lula',
    title: 'Люля-кебаб',
    items: [
      dish('lula-chicken', 'Люля куриный', '250 г', 300, 'На мангале', p('lula-chicken')),
      dish('lula-beef', 'Люля говяжий', '250 г', 420, 'На мангале', p('lula-beef')),
      dish('lula-lamb', 'Люля бараний', '250 г', 490, 'На мангале', p('lula-lamb')),
      dish('lula-pork', 'Люля свиной', '250 г', 400, 'На мангале'),
    ],
  },
  {
    id: 'assortment',
    title: 'Ассорти от шефа',
    items: [
      dish('assortment-m', 'Ассорти на 4–6 персон (M)', '3,5 кг', 4390, 'Мяса 2,4 кг · вес указан в сыром виде', p('platter')),
      dish('assortment-l', 'Ассорти на 6–8 персон (L)', '4,7 кг', 6780, 'Мяса 3,3 кг · вес указан в сыром виде', p('platter')),
      dish('assortment-xxl', 'Ассорти на 12–14 персон (XXL)', '9 кг', 11150, 'Мяса 7,2 кг · вес указан в сыром виде', p('platter')),
      dish('assortment-lula', 'Ассорти из люля-кебабов', '3,3 кг', 4050, 'Мяса 1,8 кг · вес указан в сыром виде', p('platter')),
      dish('assortment-no-pork', 'Ассорти на 6–8 персон без свинины', '5,2 кг', 6810, 'Мяса 3,9 кг · вес указан в сыром виде', p('platter')),
    ],
  },
  {
    id: 'sauces',
    title: 'Соусы',
    items: [
      dish('sauce-garlic', 'Белый чесночный', '', 60, 'Соус к блюдам на мангале'),
      dish('sauce-narsharab', 'Наршараб', '', 60, 'Соус к блюдам на мангале'),
      dish('sauce-shashlik', 'Шашлычный', '', 60, 'Соус к блюдам на мангале'),
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
