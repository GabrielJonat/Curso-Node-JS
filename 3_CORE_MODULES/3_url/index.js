const url = require('url')

const address  = "https://www.meusite.com.br/catálog?produtos=cadeira"

const parsedUrls = new url.URL(address)

console.log(parsedUrls.host)
console.log(parsedUrls.pathname)
console.log(parsedUrls.search)
console.log(parsedUrls.searchParams)
console.log(parsedUrls.searchParams.get('produtos'))