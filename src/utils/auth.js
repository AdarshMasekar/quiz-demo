export const AUTH_KEYS = {
  TOKEN: 'quiz-app-token',
  REFRESH_TOKEN: 'quiz-app-refreshToken',
  USERNAME: 'quiz-app-username',
  USER_ROLE: 'quiz-app-userRole'
};

export const isAuthenticated = () => {
  const token = localStorage.getItem(AUTH_KEYS.TOKEN);
  const username = localStorage.getItem(AUTH_KEYS.USERNAME);
  return !!(token && username);
};

export const getAuthData = () => ({
  token: localStorage.getItem(AUTH_KEYS.TOKEN),
  username: localStorage.getItem(AUTH_KEYS.USERNAME),
  role: localStorage.getItem(AUTH_KEYS.USER_ROLE)
});

export const setAuthData = (token, refreshToken, username, role) => {
  localStorage.setItem(AUTH_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(AUTH_KEYS.USERNAME, username);
  localStorage.setItem(AUTH_KEYS.USER_ROLE, role);
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_KEYS.USERNAME);
  localStorage.removeItem(AUTH_KEYS.USER_ROLE);
}; 