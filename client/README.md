# 🏗️ DYVYLO — Клієнтська частина (Архітектурний каркас проєкту)

> Лабораторна робота №3: Архітектура веб-застосунку на React + Vite, організація структури проєкту, налаштування інструментарію (ESLint, Prettier, Husky git-hooks) та тестового середовища (Cypress).

Згідно з вимогами завдання, реалізація містить **виключно архітектурний каркас (skeleton) без стилів та без готових зверстаних компонентів/бізнес-логіки**.

---

## 📁 Структура директорій (`client/`)

```text
client/
├── cypress/                        # Конфігурація та тести Cypress
│   ├── e2e/                        # End-to-End тести навігації, авторизації та каталогу
│   │   ├── auth.cy.js              # Тестування базового сценарію авторизації
│   │   ├── catalog.cy.js           # Тестування перегляду каталогу та переходу на деталі
│   │   └── navigation.cy.js        # Тестування маршрутизації та обробки 404
│   ├── fixtures/                   # Тестові мок-дані (mediaData.json)
│   └── support/                    # Допоміжні команди та файли конфігурації
│
├── public/                         # Статичні файли (favicon.svg, icons.svg)
│
├── src/                            # Вихідний код клієнтського застосунку
│   │
│   ├── components/                 # Спільні компоненти
│   │   └── ui/                     # Базові UI компоненти (каркасні заглушки)
│   │       ├── Badge/              # Badge.jsx, Badge.cy.jsx (компонентний юніт-тест)
│   │       ├── Button/             # Button.jsx, Button.cy.jsx
│   │       ├── Card/               # Card.jsx, Card.cy.jsx
│   │       ├── Input/              # Input.jsx, Input.cy.jsx
│   │       ├── Modal/              # Modal.jsx, Modal.cy.jsx
│   │       └── index.js            # Реекспорт UI-компонентів
│   │
│   ├── constants/                  # Константи проєкту
│   │   └── routes.js               # Декларативні шляхи маршрутизатора
│   │
│   ├── context/                    # Глобальний контекст стану застосунку
│   │   ├── AuthContext.jsx         # Каркас провайдера сесії користувача
│   │   ├── authContextDef.js       # Оголошення контексту
│   │   ├── BookmarksContext.jsx    # Каркас провайдера збережених елементів
│   │   └── bookmarksContextDef.js  # Оголошення контексту
│   │
│   ├── features/                   # Модулі бізнес-логіки (Feature-Driven Architecture)
│   │   ├── auth/                   # Модуль авторизації
│   │   │   ├── components/         # LoginForm.jsx, RegisterForm.jsx
│   │   │   ├── hooks/              # useAuth.js
│   │   │   └── services/           # authService.js
│   │   ├── catalog/                # Модуль каталогу
│   │   │   ├── components/         # MediaCard.jsx, MediaGrid.jsx, FilterPanel.jsx
│   │   │   ├── hooks/              # useCatalog.js
│   │   │   └── services/           # catalogService.js
│   │   ├── player/                 # Модуль відеоплеєра
│   │   │   ├── components/         # PlayerHud.jsx, TelemetryCard.jsx
│   │   │   └── hooks/              # usePlayerTelemetry.js
│   │   └── profile/                # Модуль особистого кабінету
│   │       ├── components/         # ProfileHeader.jsx, BookmarksList.jsx
│   │       └── hooks/              # useProfile.js
│   │
│   ├── hooks/                      # Спільні кастомні React хуки
│   │   ├── useBookmarks.js         # Хук доступу до обраного
│   │   ├── useDebounce.js          # Хук дебаунсу
│   │   └── useLocalStorage.js      # Хук синхронізації з localStorage
│   │
│   ├── layouts/                    # Лейаути
│   │   ├── Header.jsx              # Навігаційний заголовок (структурний)
│   │   ├── Footer.jsx              # Підвал сайту (структурний)
│   │   └── MainLayout.jsx          # Обгортка з Outlet для React Router
│   │
│   ├── pages/                      # Сторінки (маршрутні точки входу)
│   │   ├── HomePage.jsx            # Головна сторінка
│   │   ├── CatalogPage.jsx         # Сторінка каталогу
│   │   ├── TitlePage.jsx           # Сторінка перегляду релізу
│   │   ├── PlayerPage.jsx          # Сторінка відеоплеєра
│   │   ├── ProfilePage.jsx         # Сторінка профілю
│   │   ├── AuthPage.jsx            # Сторінка авторизації
│   │   └── NotFoundPage.jsx        # Сторінка 404
│   │
│   ├── routes/                     # Конфігурація маршрутизації
│   │   └── AppRoutes.jsx           # Декларативні маршрути React Router DOM
│   │
│   ├── services/                   # Спільні сервіси та API
│   │   ├── api/                    # Базовий HTTP клієнт (mediaApiService.js)
│   │   └── storage/                # Сервіс localStorage (localStorageService.js)
│   │
│   ├── utils/                      # Допоміжні утиліти
│   │   ├── formatters.js           # Форматування чисел та тривалості
│   │   └── validators.js           # Валідація форм
│   │
│   ├── App.jsx                     # Головний компонент із провайдерами
│   └── main.jsx                    # Вхідний файл монтування в DOM
│
├── .gitignore                      # Ігнорування залежностей, збірок, звітів
├── .prettierignore                 # Ігнорування Prettier
├── .prettierrc                     # Конфігурація форматування коду
├── cypress.config.js               # Конфігурація Cypress (Component + E2E)
├── eslint.config.js                # Flat Config лінтера ESLint 9
├── index.html                      # Головний HTML-шаблон
├── package.json                    # Маніфест залежностей та скриптів
└── vite.config.js                  # Конфігурація збирача Vite
```

---

## 🛠️ Технічний стек

- **Фреймворк**: [React 19](https://react.dev/)
- **Збирач проєкту**: [Vite](https://vitejs.dev/)
- **Маршрутизація**: [React Router DOM](https://reactrouter.com/)
- **Тестування**: [Cypress](https://www.cypress.io/)
  - **Component (Unit) Tests**: Тестування UI-компонентів (`Button.cy.jsx`, `Badge.cy.jsx`, `Input.cy.jsx`, `Card.cy.jsx`, `Modal.cy.jsx`)
  - **End-to-End (E2E) Tests**: Наскрізне тестування навігації та сторінок (`navigation.cy.js`, `catalog.cy.js`, `auth.cy.js`)
- **Лінтер та форматування**:
  - [ESLint 9](https://eslint.org/) (Flat Config)
  - [Prettier](https://prettier.io/)
- **Git Hooks**:
  - [Husky](https://typicode.github.io/husky/)
  - [lint-staged](https://github.com/lint-staged/lint-staged) (перевірка якості коду перед кожним комітом)

---

## 🚀 Команди запуску

```bash
# Встановлення залежностей
npm install --prefix client
npm install

# Запуск сервера розробки
npm run dev --prefix client

# Збірка проєкту
npm run build --prefix client

# Перевірка якості коду
npm run lint --prefix client
npm run format:check --prefix client

# Запуск тестів (Cypress)
npm run test:component --prefix client
npm run test:e2e --prefix client
```
