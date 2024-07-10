const eventEmitter = require('events')
const emitter = new eventEmitter()

emitter.on("start", () => {
    console.log("Durante")
})

console.log("Antes")

emitter.emit("start")

console.log("Depois")