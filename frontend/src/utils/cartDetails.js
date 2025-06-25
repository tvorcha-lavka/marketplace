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

export function isDeliveryDataValid(deliveryData, sellerIds) {
  return sellerIds.every((sellerId) => {
    const data = deliveryData[sellerId];
    if (!data || !data.type) return false;

    const isNonEmpty = (value) =>
      value !== null && value !== undefined && String(value).trim() !== '';

    switch (data.type) {
      case 'nova-poshta':
      case 'post_box':
      case 'ukrposhta':
        return isNonEmpty(data.city) && isNonEmpty(data.branch);
      case 'courier':
        return (
          isNonEmpty(data.city) &&
          isNonEmpty(data.street) &&
          isNonEmpty(data.house) &&
          isNonEmpty(data.apartment)
        );
      default:
        return false;
    }
  });
}

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

export const getInitialDeliveryFields = (type) => {
  switch (type) {
    case 'courier':
      return { type, city: '', street: '', house: '', apartment: '' };
    case 'nova-poshta':
    case 'post_box':
    case 'ukrposhta':
      return { type, city: '', branch: '' };
    default:
      return { type };
  }
};

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
