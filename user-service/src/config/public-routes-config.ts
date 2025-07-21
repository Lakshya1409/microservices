export const PUBLIC_ROUTES = [
  // Auth routes
  { path: "/api/v1/auth/login", method: "POST" },
  { path: "/api/v1/auth/register", method: "POST" },
  { path: "/api/v1/auth/refresh", method: "POST" },
  { path: "/api/v1/auth/forgot-password", method: "POST" },
  { path: "/api/v1/auth/reset-password", method: "POST" },
  { path: "/api/v1/auth/verify-email", method: "POST" },

  // Health check
  { path: "/health", method: "GET" },
  { path: "/api/health", method: "GET" },

  //service check
  { path: "/api/v1/users", method: "GET" },
  // { path: "/api/v1/users", method: "GET" },

  // Documentation
  { path: "/api/docs", method: "GET" },
  { path: "/api/v1/docs", method: "GET" },
] as const;

export const isPublicRoute = (path: string, method: string): boolean => {
  return PUBLIC_ROUTES.some((route) => {
    // Check method first
    if (route.method !== method) return false;

    // Check for exact path match
    if (route.path === path) return true;

    // Check for wildcard pattern
    if (route.path.includes("*")) {
      const pattern = route.path.replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }

    return false;
  });
};
