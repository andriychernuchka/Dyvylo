export const mediaApiService = {
  fetchMedia() {
    return Promise.resolve([]);
  },
  fetchMediaById(id) {
    return Promise.resolve({ id, title: `Title ${id}` });
  },
};

export default mediaApiService;
