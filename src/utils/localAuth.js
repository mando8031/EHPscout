const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export function registerUser(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  if (users.find(u => u.username === username)) {
    throw new Error("User already exists");
  }

  users.push({ username, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) throw new Error("Invalid login");

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
