import exp  from 'express'

import exphbs  from 'express-handlebars'

import mysql from 'mysql2'

const app = exp()

app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

app.use(exp.urlencoded({

    extended: true
}))

app.use(exp.json())

app.use(exp.static('public'))

app.post('/books/insertbook', (req, res) => {

    const title = req.body.title

    const pageqty = req.body.pageqty

    console.log(req.body)

    const command = `INSERT INTO books (??, ??) VALUES (?, ?);`

    const data = ['title', 'pageqty', title, pageqty]

    conn.query(command, data, function(err){

        if(err){

            console.log(err)
            return
        }

        res.redirect('/')
    })

})

app.post('/books/updatebook/:id', (req, res) => {

    const id = req.params.id

    const title = req.body.title

    const pageqty = req.body.pageqty

    console.log(req.body)

    const command = `UPDATE books SET title = '${title}', pageqty = ${pageqty} WHERE id = ${id};`

    conn.query(command, function(err){

        if(err){

            console.log(err)
            return
        }

        res.redirect('/')
    })

})

app.get('/books', (req, res) => {

    const command = 'SELECT * FROM books'

    conn.query(command, (err, data) => {

        if(err){

            console.log(err)
            return
        }

        const books = data

        res.render('books', {books})
    })
})

app.get('/books/editbook/:id', (req, res) => {

    const id = req.params.id

    const command = `SELECT * FROM books WHERE id = ${id}`

    conn.query(command, (err, data) => {

        if(err){

            console.log(err)
            return
        }

        const book = data[0]

        res.render('editbook', {book})
    })
})

app.get('/', (req, res) => {

    res.render('home')

})

const conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'Paodoceu7@',
    database: 'nodemysql'
})


conn.connect(function(err) {

  if(err){

    console.log(err)
  }  

  else{
  app.listen(3000, () => {

    console.log('App conectado ao mysql e rodando!')
})
  }

})
