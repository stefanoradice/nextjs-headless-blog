/**
 * Costruisce un albero gerarchico da una lista piatta di nodi.
 * @param {Array} items Lista piatta di elementi.
 * @param {Object} config Configurazione dei nomi dei campi.
 * @param {string} config.idKey Nome campo ID (default: "id").
 * @param {string} config.parentKey Nome campo parent ID (default: "parent").
 * @param {string} config.childrenKey Nome campo array figli (default: "children").
 * @param {any} config.rootParentValue Valore per identificare i nodi radice (default: 0).
 * @returns {Array} Array di nodi radice, ciascuno con figli annidati.
 */
export function buildTree(
  items,
  { idKey = 'id', parentKey = 'parent', childrenKey = 'children', rootParentValue = 0 } = {}
) {
  const itemsById = {};
  const rootItems = [];

  items.forEach((item) => {
    itemsById[item[idKey]] = { ...item, [childrenKey]: [] };
  });

  items.forEach((item) => {
    const parentId = item[parentKey];
    if (parentId === rootParentValue || parentId == null) {
      rootItems.push(itemsById[item[idKey]]);
    } else {
      const parent = itemsById[parentId];
      if (parent) {
        parent[childrenKey].push(itemsById[item[idKey]]);
      }
    }
  });

  return rootItems;
}
