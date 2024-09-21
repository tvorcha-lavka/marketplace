// Function for building a category tree
export function buildCategoryTree(categories) {
  const nodes = {};
  const tree = [];

  // Create a dictionary for quick access to nodes
  categories.forEach((cat) => {
    nodes[cat.id] = { ...cat, children: [] };
  });

  // Build a tree using the values of lft and rght
  categories.forEach((cat) => {
    if (cat.parent) {
      const parent = nodes[cat.parent];
      if (parent) {
        parent.children.push(nodes[cat.id]);
      }
    } else {
      // If a node does not have a parent, it is rooted
      tree.push(nodes[cat.id]);
    }
  });

  return tree;
}