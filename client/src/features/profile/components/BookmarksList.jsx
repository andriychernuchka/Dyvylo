export function BookmarksList({ bookmarks = [], onRemove }) {
  return (
    <div data-testid="bookmarks-list">
      <h3>Список обраного</h3>
      {bookmarks.length === 0 ? (
        <p data-testid="bookmarks-empty">Немає збережених записів</p>
      ) : (
        <ul>
          {bookmarks.map((item) => (
            <li key={item.id} data-testid={`bookmark-item-${item.id}`}>
              <span>{item.title}</span>
              {onRemove && (
                <button
                  type="button"
                  data-testid={`remove-bookmark-${item.id}`}
                  onClick={() => onRemove(item.id)}
                >
                  Видалити
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookmarksList;
