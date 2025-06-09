export const cityList = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'];

export const branchList = [
  'Від. №1: вул.Хрещатик 39, 40-566',
  'Від. №2: вул.Петра Саксаганського 39, 40-566',
  'Від. №3: вул.Збройних Сил України 39, 40-566',
  'Від. №4: вул.Хрещатик 39, 40-566',
  'Від. №5: вул. Лесі Українки 45, 40-566',
];

export const isDeliveryDataValid = (deliveryData, sellerIds) => {
  const clean = (str) => (typeof str === 'string' ? str.trim() : '');
  return sellerIds.every((ownerId) => {
    const data = deliveryData[ownerId];
    if (!data?.type) return false;

    switch (data.type) {
      case 'nova-poshta':
      case 'post_box':
      case 'ukrposhta':
        return clean(data.city) && clean(data.branch);
      case 'courier':
        return clean(data.city) && clean(data.street) && clean(data.house);
      default:
        return false;
    }
  });
};

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