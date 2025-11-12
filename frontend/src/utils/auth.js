export function getToken() {
  return localStorage.getItem("ssc_token") || null;
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("ssc_token", token);
  } else {
    localStorage.removeItem("ssc_token");
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export async function logout() {
  const token = getToken();
  try {
    await fetch("http://localhost:3000/api/auth", {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  } catch (e) {
    // ignore network errors on logout
  }
  setToken(null);
}

export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}
