export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

export const getCurrentUserRole = () => {
  const user = getCurrentUser();

  return user?.role || null;
};

export const hasRole = (allowedRoles = []) => {
  const role = getCurrentUserRole();

  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
};
