const command = process.argv.slice(2)
var name = command[0].split("=")[1]
var age = command[1].split("=")[1]
console.log(`O nome do usuário é ${name}, sua idade é ${age} anos.`)