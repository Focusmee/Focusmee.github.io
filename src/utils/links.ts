function normalizeBase() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return base === "/" ? "" : base;
}

export function withBase(path = "/") {
  const base = normalizeBase();

  if (path === "/") {
    return base ? `${base}/` : "/";
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function stripBase(pathname: string) {
  const base = normalizeBase();

  if (!base) {
    return pathname || "/";
  }

  if (pathname === base) {
    return "/";
  }

  if (pathname.startsWith(base)) {
    return pathname.slice(base.length) || "/";
  }

  return pathname || "/";
}
