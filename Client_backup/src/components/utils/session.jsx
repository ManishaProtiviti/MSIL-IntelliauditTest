export const createSession = (data, ttl = 3600) => {
  const expiry = Date.now() + ttl * 1000;
  const session = { ...data, expiry };
  sessionStorage.setItem("session", JSON.stringify(session));
  return session;
};

export const getSession = () => {
  const session = JSON.parse(sessionStorage.getItem("session"));
  if (!session || Date.now() > session.expiry) {
    clearSession();
    return null;
  }
  return session;
};

export const clearSession = () => {
  sessionStorage.removeItem("session");
};
