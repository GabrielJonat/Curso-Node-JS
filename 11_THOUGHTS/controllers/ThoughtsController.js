const Thought = require('../models/thoughts')
const User = require('../models//user')
const session = require('express-session')

module.exports = class ThoughtController{

    static async showThoughts(req,res){

        var search = ''
        var order = 'new'
        const thoughts = await Thought.findAll();
        const users = await User.findAll();
        var dict = {}
        users.forEach(user => {
            
            dict[user.id] = user.name
        })
        thoughts.forEach(thought => {
            
            thought.userName = dict[thought.UserId]
        })
            let filteredThoughts = []
        if(req.query.search){
            search = req.query.search
            thoughts.filter(thought => {

            if(thought.title.toLowerCase().includes(search.toLowerCase()))
                filteredThoughts.push(thought)
        })
        }
        else{

            filteredThoughts = thoughts
        }
        if(req.query.order){

            order = req.query.order
        }
        if(order == 'old'){

            filteredThoughts.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
              
        }
        let qtyResults = filteredThoughts.length
        res.render('thoughts/home', {session: req.session, filteredThoughts:filteredThoughts, search:search, qtyResults})
    }

    static async dashboard(req,res){
       
        console.log(req.session.userId)
        const user = await User.findOne({where: {id:req.session.userId}, include: Thought, plain: true})
        const thoughts = await Thought.findAll({where: {UserId:req.session.userId}})
        let empty = false
        if(!thoughts.length > 0)
            empty = true
        res.render('thoughts/dashboard', {session: req.session,user:user, thoughts:thoughts, empty:empty})

    }

    static async createThought(req,res){
        res.render('thoughts/create', {session: req.session})
       
    }

    static async editThought(req,res){

        const id = req.params.id
        const thought = await Thought.findOne({where: {id:id}, raw: true})
        res.render('thoughts/edit', {session: req.session, thought:thought})
       
    }

    static async editThoughtPost(req,res){

        const id = req.params.id
        const title = req.body.title
        const thought = {
            title
        }

        await Thought.update(thought,{where: {id:id}})
       
        req.flash('message', 'Pensamento editado com sucesso!')
        req.session.save(() => {

            res.redirect('/thoughts/dashboard')
        })
       
    }

    static async createThoughtPost(req,res){
        
        const thought = {

            title: req.body.title,
            UserId: req.session.userId
        }

        try{
        await Thought.create(thought)

        
        req.flash('message', 'Pensamento criado com sucesso!')
        req.session.save(() => {

            res.redirect('/thoughts/dashboard')
        })
    }
        catch(error){
            console.log(error)
        }
    }

    static async deleteThought(req,res){
        
        const id = req.params.id
        const userId = req.session.userId
        try{

        await Thought.destroy({where: {id:id,UserId:userId}})     
        req.flash('message', 'Pensamento excluido com sucesso!')
        req.session.save(() => {

            res.redirect('/thoughts/dashboard')
        })
    }
        catch(error){
            req.flash('message', 'Ocorreu um erro inesperado')
            req.session.save(() => {

            res.redirect('/thoughts/dashboard')
        })
        }
    }
}