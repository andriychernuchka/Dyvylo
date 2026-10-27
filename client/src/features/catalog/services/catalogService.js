const SAMPLE_ITEMS = [
  { id: 'item-1', title: 'Зразок медіа 1' },
  { id: 'item-2', title: 'Зразок медіа 2' },
  { id: 'item-3', title: 'Зразок медіа 3' },
];

export const catalogService = {
  getAll() {
    return Promise.resolve([...SAMPLE_ITEMS]);
  },
  getById(id) {
    const item = SAMPLE_ITEMS.find((entry) => entry.id === id);
    return Promise.resolve(item || { id, title: `Елемент ${id}` });
  },
  filter({ query = '' } = {}) {
    if (!query) return Promise.resolve([...SAMPLE_ITEMS]);
    const q = query.toLowerCase();
    return Promise.resolve(
      SAMPLE_ITEMS.filter((item) => item.title.toLowerCase().includes(q))
    );
  },
};

export default catalogService;
