const url = require('url')
const http = require('http')
const fs = require('fs')
const port = 3000

const server = http.createServer((req, res) => {

    const urlInfo = url.parse(req.url, true)

    const name = urlInfo.query.name
    
    if(!name){

    fs.readFile("mensagem.html", function(err,data){

        res.writeHead(200,{'Content-Type': 'text/html'})

        res.write(data)
        return res.end()
    })}

    else{

        const newLine = name + ',\r\t'

        fs.appendFile('arquivo.txt', newLine + '\n', {flag: 'a'}, function(err, data){

                res.writeHead(302, {location: '/', })

                return res.end()

        })
    }

})

server.listen(port, () => {

    console.log(`servidor rodando na porta ${port}`)

})