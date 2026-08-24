import { hasRole } from "../utils/roleUtils";

export default function RoleBased({
  allowedRoles = [],
  children,
  fallback = null,
}) {
  const allowed = hasRole(allowedRoles);

  if (!allowed) {
    return fallback;
  }

  return children;
}