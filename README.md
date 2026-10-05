# 🎬 ДИВИЛО (Dyvylo)

> Український архітектурний медіа-архів та розподілений стрімінг-вузол нового покоління.

### 🎨 Дизайн у Figma

👉 **[Відкрити повний проєкт та макети у Figma](https://www.figma.com/design/Z40DwlPfjQ7D8k1E2WverE/Untitled?node-id=0-1&t=YDfH5lFOXVw0fpeV-1)**

---

### ⚛️ Лабораторна робота №3 (`client/`)

**Архітектурний каркас веб-застосунку на React + Vite:**

- 📖 **[client/README.md](client/README.md)** — Опис модульної архітектури, структури директорій, конфігурацій інструментів та тестів.
- 🧱 **Архітектура**: Feature-Based / Модульна архітектура згідно з кращими практиками React. Каркас проєкту містить виключно структуру без стилів та зверстаних компонентів.
- 🛠️ **Стек**: React 19, Vite, React Router DOM, ESLint 9 (Flat Config), Prettier, Husky, lint-staged.
- 🧪 **Тестування на Cypress**:
  - **Component Tests**: Набір юніт-тестів UI-компонентів (`Button`, `Badge`, `Card`, `Input`, `Modal`).
  - **End-to-End (E2E) Tests**: Наскрізне тестування навігації, каталогу та авторизації (`navigation.cy.js`, `catalog.cy.js`, `auth.cy.js`).
- 🪝 **Git Hooks**: Pre-commit хук через Husky та lint-staged для валідації ESLint та форматування Prettier.

---

### 📁 Лабораторна робота №2 (`lab2/`)

Пакет цифрової дизайн-системи, UI Kit та веб-інтерфейсу платформи:

- 📖 **[lab2/README.md](lab2/README.md)** — Опис дизайн-системи та токенів.
- 🎨 **[lab2/components.html](lab2/components.html)** — Майстер UI Kit & Design System.
- 🧩 **[lab2/uicomponents/](lab2/uicomponents/)** — 20 модульних ізольованих компонентів.
- 🖼️ **[lab2/design/](lab2/design/)** — Графічні макети ключових сторінок та UI Kit.
