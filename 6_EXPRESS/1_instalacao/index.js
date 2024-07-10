import exp from "express"

const app = exp()

const port = 3000

const templates = "C:/Users/lucia/Documents/curso-node.js/6_EXPRESS/1_instalacao/templates"

const checkAuth = function(req, res, next){

    req.authStatus = true

    if(req.authStatus){

        res.sendFile(`${templates}/login.html`)
        next()
    }
    else{

        res.sendFile(`${templates}/block.html`)
        next()
    }
}

app.use( exp.urlencoded({

    extended: true,
}))

app.use(exp.json())

app.use(exp.static('public'))

app.get('/users/add', (req, res) => {

    res.sendFile(`${templates}/userForm.html`)
})

app.post('/users/save', (req, res) => {

    const nome = req.body.nome

    const idade = req.body.idade

    console.log(`O nome do usuário é ${nome} e ele tem ${idade} anos`)

    res.sendFile(`${templates}/userForm.html`)
})

app.get('/users/:id',(req, res) => {

    const id = req.params.id

    res.send(`estamos buscando o usuário de id = ${id}`)


})


app.get('/',(req, res) => {

    res.sendFile(`${templates}/index.html`)


})

app.use(function (req, res, next){

    res.status(404).sendFile(`${templates}/404.html`)
})

app.listen(port, () => {

    console.log(`App rodando na porta ${port}`)
})