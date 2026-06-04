require("ts-node/register")
require("tsconfig-paths/register")

const loaded = require("./medusa-config.ts")
const config = loaded.default || loaded

config.admin = {
  ...(config.admin || {}),
  disable: true,
  path: "/dashboard",
}

module.exports = config
