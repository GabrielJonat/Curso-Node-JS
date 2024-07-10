const minimist = require("minimist")

const args = minimist(process.argv.slice(2))

const name = args["name"]

const profession = args["profession"]

console.log(`O nome dele é ${name} e sua profissão é ${profession}`)