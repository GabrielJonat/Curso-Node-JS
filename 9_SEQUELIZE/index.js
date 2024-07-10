import exp from 'express'

import exphbs  from 'express-handlebars'

import handlebars from 'handlebars'

import mysql from 'mysql2'

const conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'Paodoceu7@',
    database: 'nodemysql'
})


const app = exp();

import { Sequelize, DataTypes, where } from 'sequelize';

const sqlz = new Sequelize('nodemysql', 'root', 'Paodoceu7@', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    sqlz.authenticate();
    console.log('Sequelize conectado com sucesso!');
} catch (err) {
    console.log(err);
}

const Users = sqlz.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occupation: {
        type: DataTypes.STRING,
        allowNull: false  // Changed from 'required: true' to 'allowNull: false' for consistency with Sequelize's API
    },
    newsLetter: {
        type: DataTypes.BOOLEAN
    },
});

const Adress = sqlz.define('Adress', {
    street: {
        type: DataTypes.STRING,
        },
    number: {
        type: DataTypes.STRING,
    },
    complement: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING
    },
});

const Dependent = sqlz.define('Dependent', {
    name: {
        type: DataTypes.STRING,
        }
});

Users.hasMany(Dependent)

Adress.belongsTo(Users)

Dependent.belongsTo(Users)

app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

app.use(exp.urlencoded({

    extended: true
}))

app.use(exp.json())

app.use(exp.static('public'))

app.post('/users/create', async (req,res) => {

    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsLetter === 'on'
    const street = req.body.street
    const number = req.body.number
    const complement = req.body.complement
    const city = req.body.city 

    console.log(req.body)
    
    const command = `INSERT INTO Users (name, occupation, newsLetter, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);`;

      const data = [name, occupation, newsletter, new Date(), new Date()];

    console.log(data)

    conn.query(command, data, function(err) {

        if(err){

            console.log(err)
        }
    })

    const user = await Users.findOne({where: {name: name}})

    const adressCommand = `INSERT INTO Adresses (street, number, complement, city, createdAt, updatedAt, UserId) VALUES (?, ?, ?, ?, ?, ?, ?);`;

      const adressData = [street, number, complement, city, new Date(), new Date(), user.id];

    console.log(adressData)

    conn.query(adressCommand, adressData, function(err) {

        if(err){

            console.log(err)
        }
    })
    
    res.redirect('/')
    
})

app.get('/', async (req,res) => {

    const users = await Users.findAll({raw:true})

    res.render('home', {users: users})

})


app.get('/users/edit/:id', async (req,res) => {
    const id = req.params.id
    const user = await Users.findOne({raw: true, where: {id: id}})
    const adress = await Adress.findOne({raw: true, where: {UserId: id}})
    console.log({user, adress})
    res.render('userEdit', {user: user, adress: adress})
})

app.get('/users/:id', async (req,res) => {

    const id = req.params.id
    const user = await Users.findOne({include: Dependent, where: {id: id}})
    const adress = await Adress.findOne({raw: true, where: {UserId: id}})
    res.render('userViews', {user: user.get({plain: true}), adress: adress})

})

app.get('/users/addDependent/:id', async (req,res) => {

    const id = req.params.id
    const user = await Users.findOne({raw: true, where: {id: id}})
    res.render('addDependent', {user: user})

})

app.post('/users/delete/:id', async (req,res) => {

    const id = req.params.id
    await Users.destroy({raw: true, where: {id: id}})

    res.redirect('/')

})

app.post('/dependents/delete/:id', async (req,res) => {

    const id = req.params.id
    const dependent = await Dependent.findOne({where: {id:id}})
    const userId = dependent.UserId
    await Dependent.destroy({raw: true, where: {id: id}})

    res.redirect(`/users/${userId}`)

})

app.post('/users/update/:id', async (req,res) => {

    const id = req.params.id

    const name = req.body.name
    const occupation = req.body.occupation
    let newsLetter
    req.body.newsLetter=== 'on'? newsLetter = 1 : newsLetter = 0 
    const street = req.body.street
    const number = req.body.number
    const complement = req.body.complement
    const city = req.body.city
    const userData = {
        id,
        name,
        occupation,
        newsLetter
    }
    const adressData = {

        id,
        street,
        number,
        complement,
        city
    }
    console.log(userData)
    await Users.update(userData,{where: {id: id}})
    await Adress.update(adressData,{where: {Userid: id}})
    res.redirect('/')
})

app.post('/users/addDependent/:id', async (req,res) => {

    const id = req.params.id

    const name = req.body.name
    
    const dependentCommand = `INSERT INTO Dependents (name, createdAt, updatedAt, UserId) VALUES (?, ?, ?, ?);`;

      const dependentData = [name, new Date(), new Date(), id];

    console.log(dependentData)

    conn.query(dependentCommand, dependentData, function(err) {

        if(err){

            console.log(err)
        }
    })
    
    res.redirect('/')

})

// Sync database
sqlz.sync({force: false})
    .then(() => {
        console.log('Database synced');
        conn.connect(function (err){

            if(err){
                
                console.log(err);

            }
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });

        })
        
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });