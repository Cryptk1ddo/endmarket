require("ts-node/register")
require("tsconfig-paths/register")

const loaded = require("./medusa-config.ts")

module.exports = loaded.default || loaded
