function normalizeBase() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return base === "/" ? "" : base;
}

function splitSuffix(path: string) {
  const match = path.match(/^([^?#]*)([?#].*)?$/);

  return {
    pathname: match?.[1] || path,
    suffix: match?.[2] || ""
  };
}

function isFilePath(pathname: string) {
  return /\/[^/]+\.[^/]+$/.test(pathname);
}

export function withBase(path = "/") {
  const base = normalizeBase();

  if (path === "/") {
    return base ? `${base}/` : "/";
  }

  const rawPath = path.startsWith("/") ? path : `/${path}`;
  const { pathname, suffix } = splitSuffix(rawPath);
  const normalizedPath =
    pathname.endsWith("/") || isFilePath(pathname)
      ? pathname
      : `${pathname}/`;

  return `${base}${normalizedPath}${suffix}`;
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
