import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookmarksProvider } from './context/BookmarksContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookmarksProvider>
          <AppRoutes />
        </BookmarksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
