import { media } from './mediaConfig';

const cityList = [
  'Вінниця',
  'Дніпро',
  'Донецьк',
  'Житомир',
  'Запоріжжя',
  'Івано-Франківськ',
  'Київ',
  'Кропивницький',
  'Луганськ',
  'Луцьк',
  'Львів',
  'Миколаїв',
  'Одеса',
  'Полтава',
  'Рівне',
  'Суми',
  'Тернопіль',
  'Ужгород',
  'Харків',
  'Херсон',
  'Хмельницький',
  'Черкаси',
  'Чернівці',
  'Чернігів',
];

const branchList = [
  { name: 'Від. №1', address: 'вул. Хрещатик 39, 40-566' },
  { name: 'Від. №2', address: 'вул. Петра Саксаганського 39, 40-566' },
  { name: 'Від. №3', address: 'вул. Збройних Сил України 39, 40-566' },
  { name: 'Від. №4', address: 'вул. Шевченка 12, 40-566' },
  { name: 'Від. №5', address: 'вул. Лесі Українки 45, 40-566' },
  { name: 'Від. №6', address: 'вул. Грушевського 10, 40-566' },
  { name: 'Від. №7', address: 'вул. Січових Стрільців 8, 40-566' },
  { name: 'Від. №8', address: 'вул. Богдана Хмельницького 21, 40-566' },
  { name: 'Від. №9', address: 'вул. Франка 14, 40-566' },
  { name: 'Від. №10', address: 'вул. Володимирська 5, 40-566' },
  { name: 'Від. №11', address: 'вул. Пушкіна 17, 40-566' },
  { name: 'Від. №12', address: 'вул. Академіка Глушкова 2, 40-566' },
  { name: 'Від. №13', address: 'вул. Інститутська 11, 40-566' },
  { name: 'Від. №14', address: 'вул. Антоновича 33, 40-566' },
  { name: 'Від. №15', address: 'вул. Прорізна 7, 40-566' },
];

export const fakeDepartments = cityList.flatMap((city, cityIndex) =>
  branchList.map((branch, branchIndex) => ({
    id: cityIndex * branchList.length + branchIndex + 1,
    city,
    name: branch.name,
    address: branch.address,
  }))
);

const isNonEmpty = (value) =>
  value !== null && value !== undefined && String(value).trim() !== '';

const DELIVERY_VALIDATION_MAP = {
  'nova-poshta': (data) => isNonEmpty(data.city) && isNonEmpty(data.branch),
  post_box: (data) => isNonEmpty(data.city) && isNonEmpty(data.branch),
  ukrposhta: (data) => isNonEmpty(data.city) && isNonEmpty(data.branch),
  courier: (data) =>
    isNonEmpty(data.city) &&
    isNonEmpty(data.street) &&
    isNonEmpty(data.house) &&
    isNonEmpty(data.apartment),
};

export const isDeliveryDataValid = (deliveryData, sellerIds) =>
  sellerIds.every((sellerId) => {
    const data = deliveryData[sellerId];
    if (!data || !data.type) return false;

    const validate = DELIVERY_VALIDATION_MAP[data.type];
    return validate ? validate(data) : false;
  });

export const deliveryOptions = [
  {
    type: 'nova-poshta',
    label: 'Доставка Нова Пошта у відділення',
    cost: 'від 120 грн',
  },
  {
    type: 'post_box',
    label: 'Доставка Нова Пошта до поштомату',
    cost: 'від 120 грн',
  },
  { type: 'courier', label: 'Курʼєрська доставка', cost: 'від 135 грн' },
  {
    type: 'ukrposhta',
    label: 'Доставка Укрпошта до відділення',
    cost: 'від 80 грн',
  },
];

export const DELIVERY_PRICES = {
  'nova-poshta': 120,
  post_box: 120,
  courier: 135,
  ukrposhta: 80,
};

const DELIVERY_INITIAL_FIELDS_MAP = {
  courier: { city: '', street: '', house: '', apartment: '' },
  'nova-poshta': { city: '', branch: '' },
  post_box: { city: '', branch: '' },
  ukrposhta: { city: '', branch: '' },
};

export const getInitialDeliveryFields = (type) => ({
  type,
  ...(DELIVERY_INITIAL_FIELDS_MAP[type] || {}),
});

export const deliveryType = [
  {
    name: 'Нова пошта',
    width: 129,
    height: 50,
    img: `${media}/logo/Nova_Poshta_logo.png`,
  },
  {
    name: 'Укрпошта',
    width: 161,
    height: 56,
    img: `${media}/logo/ukrposhta_logo.png`,
  },
];

export const FIELDS = [
  { field: 'city', label: 'Місто', placeholder: 'місто', width: '226px' },
  { field: 'street', label: 'Вулиця', placeholder: 'вулиця', width: '226px' },
  { field: 'house', label: 'Будинок', placeholder: 'буд', width: '72px' },
  { field: 'apartment', label: 'Кв', placeholder: 'кв', width: '54px' },
];
