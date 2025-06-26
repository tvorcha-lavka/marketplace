export function buildCategoryTree(categories) {
  const nodes = {};
  const tree = [];

  categories.forEach((cat) => {
    nodes[cat.id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parent_id) {
      const parent_id = nodes[cat.parent_id];
      if (parent_id) {
        parent_id.children.push(nodes[cat.id]);
      }
    } else {
      tree.push(nodes[cat.id]);
    }
  });

  return tree;
}
