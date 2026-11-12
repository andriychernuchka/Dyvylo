import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, Modal } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { forgotPassword, resetPassword } from "../api/auth";
import styles from "./AuthPage.module.css";

const mutedText = {
  fontSize: 12,
  color: "var(--text-muted)",
  lineHeight: 1.6,
};

export function AuthPage() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading, error } = useAuth();
  // Return to the page the guard redirected from (e.g. /profile)
  const redirectTo = location.state?.from?.pathname || "/profile";

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotToken, setForgotToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tab === "login") {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      navigate(redirectTo);
    } catch {
      // The hook stores the error message and it is rendered below.
    }
  };

  const openForgot = () => {
    setForgotOpen(true);
    setForgotStep("email");
    setForgotEmail(email);
    setForgotToken("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setSuccessNotice("");
  };

  const closeForgot = () => {
    if (forgotLoading) return;
    setForgotOpen(false);
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");

    try {
      const data = await forgotPassword(forgotEmail.trim());
      setForgotToken(data?.resetToken || "");
      setForgotStep("reset");
    } catch (err) {
      setForgotError(err.message || "Не вдалося створити токен відновлення");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");

    if (newPassword !== confirmPassword) {
      setForgotError("Пароль і підтвердження не збігаються");
      return;
    }

    setForgotLoading(true);

    try {
      await resetPassword(forgotToken, newPassword);
      setTab("login");
      setEmail(forgotEmail);
      setPassword("");
      setSuccessNotice("Пароль змінено. Тепер увійдіть із новим паролем.");
      setForgotStep("done");
    } catch (err) {
      setForgotError(err.message || "Не вдалося змінити пароль");
    } finally {
      setForgotLoading(false);
    }
  };

  const modalTitle = {
    email: "Відновлення пароля",
    reset: "Новий пароль",
    done: "Пароль змінено",
  }[forgotStep];

  return (
    <div className="container">
      <div className={styles.authContainer} data-testid="auth-page">
        <div className={styles.box}>
          <div className={styles.topLogo}>
            <div
              style={{
                width: 32,
                height: 32,
                border: "1px solid var(--accent-primary)",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-primary)",
              }}
            >
              [·]
            </div>
            <h2 className={styles.title}>
              {tab === "login" ? "Вхід у термінал" : "Реєстрація вузла"}
            </h2>
            <p className={styles.sub}>
              {tab === "login"
                ? "Авторизація користувача платформи ДИВИЛО"
                : "Створення облікового запису та персонального списку"}
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${tab === "login" ? styles.activeTab : ""}`}
              onClick={() => setTab("login")}
            >
              Вхід
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === "register" ? styles.activeTab : ""}`}
              onClick={() => setTab("register")}
            >
              Реєстрація
            </button>
          </div>

          {successNotice && (
            <p
              role="status"
              style={{
                color: "var(--status-live, #10b981)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {successNotice}
            </p>
          )}

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            data-testid="auth-form"
          >
            {tab === "register" && (
              <Input
                label="Нік"
                placeholder="Наприклад: nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Електронна пошта"
              type="email"
              placeholder="nick@dyvylo.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className={styles.checkboxRow}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" defaultChecked />
                <span>Запам&apos;ятати цей пристрій</span>
              </label>
              <button
                type="button"
                onClick={openForgot}
                style={{
                  color: "var(--accent-primary)",
                  cursor: "pointer",
                  fontSize: 11,
                }}
              >
                Забули пароль?
              </button>
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  color: "var(--status-error, #ff4d6d)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading
                ? "З'єднання..."
                : tab === "login"
                  ? "Увійти в термінал"
                  : "Зареєструвати вузол"}
            </Button>
          </form>
        </div>
      </div>

      <Modal isOpen={forgotOpen} onClose={closeForgot} title={modalTitle}>
        {forgotStep === "email" && (
          <form onSubmit={handleForgotEmail}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={mutedText}>
                Вкажіть електронну пошту акаунта. Ми створимо токен відновлення,
                чинний 15 хвилин.
              </p>
              <Input
                label="Електронна пошта"
                type="email"
                placeholder="nick@dyvylo.net"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                required
              />
              {forgotError && (
                <p
                  role="alert"
                  style={{
                    color: "var(--status-error, #ff4d6d)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {forgotError}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button variant="ghost" onClick={closeForgot}>
                  Скасувати
                </Button>
                <Button type="submit" variant="primary" disabled={forgotLoading}>
                  {forgotLoading ? "Створення..." : "Отримати токен"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {forgotStep === "reset" && (
          <form onSubmit={handleResetPassword}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={mutedText}>
                Демо-токен для <strong>{forgotEmail}</strong> (діє 15 хвилин):
              </p>
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--accent-primary)",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  padding: 8,
                  overflowWrap: "anywhere",
                }}
              >
                {forgotToken}
              </code>
              <Input
                label="Новий пароль"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={6}
                required
              />
              <Input
                label="Підтвердження пароля"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
              />
              {forgotError && (
                <p
                  role="alert"
                  style={{
                    color: "var(--status-error, #ff4d6d)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {forgotError}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button variant="ghost" onClick={closeForgot}>
                  Скасувати
                </Button>
                <Button type="submit" variant="primary" disabled={forgotLoading}>
                  {forgotLoading ? "Збереження..." : "Змінити пароль"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {forgotStep === "done" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ ...mutedText, color: "var(--status-live, #10b981)" }}>
              Пароль для {forgotEmail} успішно змінено.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="primary" onClick={closeForgot}>
                До входу
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AuthPage;
