// ***********************************************
// Custom Cypress commands for Dyvylo Web
// ***********************************************

Cypress.Commands.add('loginAsMockUser', () => {
  window.localStorage.setItem(
    'dyvylo_auth_user',
    JSON.stringify({
      id: 'usr_01',
      name: 'Андрій_Ч',
      email: 'andriy@dyvylo.net',
      role: 'Archivist',
      node: 'KYIV-PECHERSK-01',
      token: 'jwt_mock_token_dyvylo_2026',
    })
  );
});
