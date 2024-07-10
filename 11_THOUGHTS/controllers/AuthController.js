const Thought = require('../models/thoughts')
const User = require('../models//user')
const bcrypt = require('bcryptjs')

module.exports = class AuthController{

    static async login(req,res){
        res.render('auth/login')
    }

    static async loginPost(req,res){
        
        const {email, password} = req.body

        const user = await User.findOne({where: {email:email}})

        if(!user){

            req.flash('message', 'O email informado não está cadastrado')
            req.session.save(() => {

                res.redirect('/')
            })
        }
        else{
            let passwordMatch = bcrypt.compareSync(password,user.password)
        
        if(!passwordMatch){

            req.flash('message', 'Senha invalida!')
            req.session.save(() => {

                res.redirect('/')
            })
 
        }

        else{
            req.session.userId = user.id
            req.flash('message', 'autenticação realizada com sucesso!')
            req.session.save(() => {
                
                res.redirect('/')
            })
        }
        }
    }

    static async logout(req,res){
        
        req.session.destroy()
        res.redirect('/login')
    }

    static async register(req,res){
        res.render('auth/register')
    }

    static async postRegister(req,res){
        
        const {name, email, password, confirmPassword} = req.body

        if(password != confirmPassword){

            req.flash('message', 'As senhas não são identicas, tente novamente!')
            res.render('auth/register')
            return
        }
        
        const checkIfUserExists = await User.findOne({where: {email: email}})

        if(checkIfUserExists){

            req.flash('message', 'O email informado já está em uso')
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10)

        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {

            name,
            email,
            password:hashedPassword
        }

        try{
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            req.flash('message', 'cadastro realizado com sucesso!')
            req.session.save(() => {

                res.redirect('/')
            })
        }
        catch(err){
            console.log(err)
        }
        
    }

}