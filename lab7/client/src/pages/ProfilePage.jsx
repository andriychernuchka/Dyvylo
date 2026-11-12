import { useState } from "react";
import { MediaCard } from "../features/catalog/components/MediaCard";
import { Badge, Button, Input, Modal } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useBookmarks } from "../hooks/useBookmarks";
import { useProfile } from "../hooks/useProfile";
import { updateStoredUser } from "../api/auth";
import styles from "./ProfilePage.module.css";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ProfilePage() {
  const { user: authUser } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    update,
    updatePassword,
  } = useProfile();
  const { bookmarks, loading, error, remove, clear } = useBookmarks();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const displayName = profile?.name || authUser?.name || "nick";
  const avatarLetter = displayName[0].toUpperCase();

  const openEdit = () => {
    setEditForm({
      name: profile?.name || authUser?.name || "",
      email: profile?.email || authUser?.email || "",
    });
    setFormError("");
    setFormSuccess("");
    setEditOpen(true);
  };

  const openPassword = () => {
    setPasswordForm(emptyPasswordForm);
    setFormError("");
    setFormSuccess("");
    setPasswordOpen(true);
  };

  const handleRemove = async (id) => {
    try {
      await remove(id);
    } catch {
      // The error is stored inside useBookmarks and rendered below.
    }
  };

  const handleClear = async () => {
    if (!bookmarks.length) return;
    try {
      await clear();
    } catch {
      // The error is stored inside useBookmarks and rendered below.
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setFormSuccess("");

    try {
      const next = await update({
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      });
      updateStoredUser(next);
      setFormSuccess("Профіль оновлено");
      setEditOpen(false);
    } catch (err) {
      setFormError(err.message || "Не вдалося оновити профіль");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setFormSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError("Новий пароль і підтвердження не збігаються");
      setSaving(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setFormSuccess("Пароль змінено");
      setPasswordOpen(false);
    } catch (err) {
      setFormError(err.message || "Не вдалося змінити пароль");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.profile} data-testid="profile-page">
        {/* User Card */}
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{avatarLetter}</div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <h1 className={styles.name}>@{displayName}</h1>
                <Badge variant="live" liveDot>
                  АКТИВНИЙ ВУЗОЛ
                </Badge>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {profile?.email || authUser?.email || "Шлюз: UA-KYIV-MIRROR-01"}
              </p>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Переглянуто</span>
              <span className={styles.statVal}>
                {profileLoading ? "…" : `${profile?.stats?.watchedHours ?? 0} год`}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>В обраному</span>
              <span className={styles.statVal}>
                {loading ? "…" : `${bookmarks.length} тайтли`}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Аптайм</span>
              <span className={styles.statVal}>
                {profileLoading ? "…" : `${profile?.stats?.uptimePercent ?? 99.98}%`}
              </span>
            </div>
          </div>
        </div>

        {(profileError || formSuccess) && (
          <p
            role={profileError ? "alert" : "status"}
            style={{
              color: profileError
                ? "var(--status-error, #ff4d6d)"
                : "var(--status-live, #10b981)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          >
            {profileError || formSuccess}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" size="sm" onClick={openEdit}>
            Редагувати профіль
          </Button>
          <Button variant="ghost" size="sm" onClick={openPassword}>
            Змінити пароль
          </Button>
        </div>

        {/* Bookmarks Section */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: 8,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Мої закладки (Обране)
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={loading || bookmarks.length === 0}
            >
              Очистити список
            </Button>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                color: "var(--status-error, #ff4d6d)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {error}
            </p>
          )}

          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Завантаження закладок...
            </p>
          ) : bookmarks.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border-subtle)",
                padding: 28,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              У вас ще немає закладок. Додайте тайтл зі сторінки релізу.
            </div>
          ) : (
            <div className={styles.grid}>
              {bookmarks.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemove(item.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Редагування профілю"
      >
        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              label="Нік"
              value={editForm.name}
              onChange={(event) =>
                setEditForm((current) => ({ ...current, name: event.target.value }))
              }
              minLength={2}
              maxLength={50}
              required
            />
            <Input
              label="Електронна пошта"
              type="email"
              value={editForm.email}
              onChange={(event) =>
                setEditForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
            {formError && (
              <p
                role="alert"
                style={{
                  color: "var(--status-error, #ff4d6d)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {formError}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setEditOpen(false)}>
                Скасувати
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Збереження..." : "Зберегти"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Зміна пароля"
      >
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              label="Поточний пароль"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              required
            />
            <Input
              label="Новий пароль"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              minLength={6}
              required
            />
            <Input
              label="Підтвердження пароля"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              minLength={6}
              required
            />
            {formError && (
              <p
                role="alert"
                style={{
                  color: "var(--status-error, #ff4d6d)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {formError}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setPasswordOpen(false)}>
                Скасувати
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Збереження..." : "Змінити пароль"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProfilePage;
