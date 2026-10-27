import { useEffect, useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { TitlePage } from "./pages/TitlePage";
import { AuthPage } from "./pages/AuthPage";
import { ProfilePage } from "./pages/ProfilePage";

function getPageFromHash() {
  return window.location.hash.slice(1).split("?")[0] || "home";
}

export function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const pages = {
    home: <HomePage />,
    catalog: <CatalogPage />,
    player: <TitlePage />,
    details: <TitlePage />,
    auth: <AuthPage />,
    profile: <ProfilePage />,
  };

  return (
    <MainLayout>
      {pages[page] || <HomePage />}
    </MainLayout>
  );
}

export default App;
