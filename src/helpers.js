export const prefixName = (contextName, name) =>
  name ? (contextName ? contextName + '.' : '') + name : contextName || ''
