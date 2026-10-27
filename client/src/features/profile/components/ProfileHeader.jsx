export function ProfileHeader({ user }) {
  return (
    <header data-testid="profile-header">
      <h2>Користувач: {user?.name || 'Гість'}</h2>
      <p>Email: {user?.email || 'Не вказано'}</p>
    </header>
  );
}

export default ProfileHeader;
