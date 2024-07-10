const minimist = require("minimist")

const args = minimist(process.argv.slice(2))

const a = parseInt(args["a"])

const b = parseInt(args["b"])

const soma = require("./soma.js")

soma.sum(a, b)