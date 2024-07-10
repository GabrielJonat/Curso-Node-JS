import exp  from 'express'

import exphbs  from 'express-handlebars'

const app = exp()

const hbs = exphbs.create({

    partialsDir: ['views/partials'],
})

app.engine('handlebars', hbs.engine)

app.set('view engine', 'handlebars')

app.use(exp.static('public'))

app.get('/blog', (req, res) => {

    const posts = [{titulo: 'Post de abertura', data: '22/06/2024', hora: '11:35', valor: 'Primeiro post do blog', comentarios: 3},
        {titulo: 'Boas vindas', data: '22/06/2024', hora: '11:35', valor: 'bem vindos ao nosso blog', comentarios: 1}
    ]

    res.render('blog', {posts})
})

app.get('/post', (req, res) => {

    const post = {titulo: 'Post de abertura', data: '22/06/2024', hora: '11:35', valor: 'Primeiro post do blog', comentarios: 3}

    res.render('blogpost', {post})
})
app.get('/dashboard', (req, res) => {

    const items = ['banana', 'melão', 'melancia']

    res.render('dashboard', {items})

})

app.get('/', (req, res) => {

    const user = {nome: 'Matheus', sobrenome: 'Batisti', idade: 30}

    const auth = true

    const aprovado = true

    res.render('home', {user: user, auth, aprovado})

})

app.listen(3000, () => {

    console.log('App rodando!')
})