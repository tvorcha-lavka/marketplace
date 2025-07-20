export const findCategoriesFromFullPath = (titles, categories) => {
  const result = [];
  let parentId = null;

  for (const title of titles) {
    const category = categories.find(
      (item) => item.title === title && item.parent_id === parentId
    );
    if (!category) break;
    result.push(category);
    parentId = category.id;
  }

  return result;
};

export function buildFullCategoryPathFromId(categoryId, categoriesFlat) {
  const path = [];

  let current = categoriesFlat.find((cat) => cat.id === Number(categoryId));

  while (current) {
    path.unshift(current);
    current = categoriesFlat.find((cat) => cat.id === current.parent_id);
  }

  return path;
}
