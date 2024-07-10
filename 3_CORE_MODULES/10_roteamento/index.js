const url = require('url')
const http = require('http')
const fs = require('fs')
const port = 3000

const server = http.createServer((req, res) => {

    const querry = url.parse(req.url, true)
    const fileName = querry.pathname.substring(1)
    
    if(fileName.includes('html')){

        if(fs.existsSync(fileName)){

            fs.readFile(fileName, function(err, data){

                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                return res.end()

            })

        }
        else{

            fs.readFile('404.html', function(err, data){

                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                return res.end()

            })

        }

    }

})

server.listen(port, () => {

    console.log(`servidor rodando na porta ${port}`)

})