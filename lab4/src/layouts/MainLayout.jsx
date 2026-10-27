import { Header } from './Header';
import { Footer } from './Footer';
import styles from './MainLayout.module.css';

export function MainLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
