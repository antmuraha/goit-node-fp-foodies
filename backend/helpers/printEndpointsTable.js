const METHOD_COLORS = {
  GET: "\x1b[36m",
  POST: "\x1b[32m",
  PUT: "\x1b[33m",
  PATCH: "\x1b[33m",
  DELETE: "\x1b[31m",
  reset: "\x1b[0m",
};

const buildRoutes = (routerPaths) => {
  const routes = [];

  routerPaths.forEach(([basePath, router]) => {
    if (!router?.stack) {
      return;
    }

    router.stack.forEach((layer) => {
      if (!layer.route) {
        return;
      }

      const methods = Object.keys(layer.route.methods).map((method) => method.toUpperCase());

      routes.push({
        path: basePath + (layer.route.path || ""),
        methods,
      });
    });
  });

  return routes;
};

const groupRoutesByPath = (routes) => {
  const groupedRoutes = {};

  routes.forEach(({ path, methods }) => {
    if (!groupedRoutes[path]) {
      groupedRoutes[path] = [];
    }

    groupedRoutes[path].push(...methods);
  });

  return groupedRoutes;
};

const colorizeMethods = (methods) =>
  methods.map((method) => `${METHOD_COLORS[method] || ""}${method}${METHOD_COLORS.reset}`).join(", ");

export const printEndpointsTable = (routerPaths) => {
  const routes = buildRoutes(routerPaths);
  const groupedRoutes = groupRoutesByPath(routes);
  const paths = Object.keys(groupedRoutes);

  if (paths.length === 0) {
    console.log("No routes found");
    return;
  }

  const maxPathLength = Math.max(...paths.map((path) => path.length));

  console.log(`\n  ${"Path".padEnd(maxPathLength + 2)}Methods`);
  console.log(`  ${"-".repeat(maxPathLength + 2)}${"-".repeat(40)}`);

  paths.forEach((path) => {
    const uniqueMethods = [...new Set(groupedRoutes[path])].sort();
    const methodsLabel = colorizeMethods(uniqueMethods);

    console.log(`  ${path.padEnd(maxPathLength + 2)}${methodsLabel}`);
  });
};
