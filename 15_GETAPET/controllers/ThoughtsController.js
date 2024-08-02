const Thought = require('../models/thoughts')
const User = require('../models/user')
const Adoption = require('../models/adoption')
const Talk = require('../models/talk')
const Message = require('../models/message')
const session = require('express-session')
const axios = require('axios')
const { use } = require('../routes/thoughtsRoutes')

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
        const response = await axios.get('http://random.dog/woof.json')
        const image = response.data.url
        console.log(image)
        res.render('thoughts/home', {session: req.session, filteredThoughts:filteredThoughts, search:search, qtyResults,image:image})
    }

    static async dashboard(req,res){
       
        console.log(req.session.userId)
        const user = await User.findOne({where: {id:req.session.userId}, include: Thought, plain: true})
        const thoughts = await Thought.findAll({where: {UserId:req.session.userId}})
        const adoption = await Adoption.findAll()
        let ids = []
        let thoughtIds = []
        thoughts.forEach(ele => {

            thoughtIds.push(ele.id)
        })
        adoption.forEach(adp => {

            if(thoughtIds.includes(adp.ThoughtId))
                ids.push(adp.ThoughtId)
        })
        thoughts.forEach(ele => {
            if(ids.includes(ele.id))
                ele.case = true
            else
                ele.case = false
        }) 
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

        console.log(req.body)
        const id = req.params.id
        const imageUrl = `/uploads/${req.file.filename}`;
        const thought = {

            title: req.body.title,
            weight: req.body.weight,
            age: req.body.age,
            color: req.body.color,
            image: imageUrl,
            available: true,
            UserId: req.session.userId
        }


        await Thought.update(thought,{where: {id:id}})
       
        req.flash('message', 'Pet editado com sucesso!')
        req.session.save(() => {

            res.redirect('/thoughts/dashboard')
        })
       
    }

    static async createThoughtPost(req,res){
        
        console.log(req.body)
        const imageUrl = `/uploads/${req.file.filename}`;
        const thought = {

            title: req.body.title,
            weight: req.body.weight,
            age: req.body.age,
            color: req.body.color,
            image: imageUrl,
            available: true,
            UserId: req.session.userId
        }

        try{
        await Thought.create(thought)

        
        req.flash('message', 'Pet cadastrado com sucesso!')
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
        req.flash('message', 'Pet excluido com sucesso!')
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

    static async adopt(req, res){

        console.log(req.session.userId)
        if(!req.session.userId){

            req.flash('message', 'Autentique-se para adotar um Pet')
            req.session.save(() => {

                res.redirect('/')
            })  
        }
        else{
            const id = req.params.id
            const userId = req.session.userId
            const adoptions = await Adoption.findAll({where:{ThoughtId:id}})
            if(adoptions.length > 0){
                console.log(adoptions, 'tá errado!')
                req.flash('message', 'Este Pet já tem uma adoção em andamento.')
                req.session.save(() => {

                    res.redirect('/')
                })
            }
            else{
            const thought = await Thought.findOne({where: {id:id}, raw: true})
            if(thought.UserId === userId){

            req.flash('message', 'Não é possível adotar seu próprio Pet!')
            req.session.save(() => {

                res.redirect('/thoughts/dashboard')
            })    
            }
            else{
                const adoption = {
                    status: false,
                    UserId: userId,
                    ThoughtId: thought.id
                }
                await Adoption.create(adoption)
                req.flash('message', 'Adoção requisitada com sucesso, aguardando resposta do dono!')
                req.session.save(() => {

                    res.redirect('/thoughts/dashboard')
                })
            }
        }
        }
    }

    static async adoptions(req,res){

        const user = await User.findOne({where: {id:req.session.userId}})
        const adoptions = await Adoption.findAll({where: {UserId:req.session.userId},})
        let empty = false
        let util = []
        if(!adoptions)
            empty = true
        adoptions.forEach(async value => {
            const thought = await Thought.findOne({where:{id:value.ThoughtId}})
            if(thought){
            const user = await User.findOne({where:{id:thought.UserId}})
            thought.ownerEmail = user.email
            util.push(thought)
            }
        })
        console.log(util)
        res.render('thoughts/adoptions', {session: req.session, user:user, empty:empty, util:util})
    }

    static async getFriends(req,res){

        const user = await User.findOne({where: {id:req.session.userId}})
        const adoptions = await Adoption.findAll({where: {UserId:req.session.userId},})
        let empty = false
        const util = new Set()
        if(!adoptions)
            empty = true
        adoptions.forEach(async value => {
            const thought = await Thought.findOne({where:{id:value.ThoughtId}})
            if(thought){
            const user = await User.findOne({where:{id:thought.UserId}})
            thought.ownerEmail = user.email
            const talks = await Talk.findOne({where: {user1:req.session.userId,user2:user.id}})
            const talks2 = await Talk.findOne({where: {user1:user.id,user2:req.session.userId}})
            console.log(talks,talks2)    
            if(!(talks || talks2)){

                await Talk.create({user1:req.session.userId,user2:user.id})
            }
            util.add(thought.ownerEmail)
            }
        })
        const thoughts = await Thought.findAll({where: {UserId:req.session.userId}})
        thoughts.forEach(async value => {

            const owner = await User.findOne({where: {id:value.adopter}})
            if(owner){
                util.add(owner.email)
            }
        })
        console.log(util)
        res.render('thoughts/friends', {session: req.session, user:user, empty:empty, util:util})
    }

    static async finishAdoption(req,res){

        const id = req.params.id
        const thought = await Thought.findOne({where:{id:id}})
        const adoptions = await Adoption.findAll({where: {ThoughtId:id},})
        for (const adp of adoptions) {
            adp.status = 1;
            thought.adopter = adp.UserId; // Assuming UserId is the adopter's ID
            await adp.save(); // Save each adoption instance
          }
          
          // Save the updated thought
          thought.available = 0
          await thought.save();
          
        req.flash('message', 'Adoção realizada com sucesso!')
        req.session.save(() => {

            res.redirect('/')
        })
        
    }

    static async rejectAdoption(req,res){

        const id = req.params.id
        await Adoption.destroy({raw:true,where: {ThoughtId:id},})
        req.flash('message', 'Adoção rejeitada!')
        req.session.save(() => {

            res.redirect('/')
        })
        
    }

    static async chat(req,res){

            const email = req.params.email
            const friend = await User.findOne({where: {email:email}})
            const user = await User.findOne({where: {id:req.session.userId}})
            const talk = await Talk.findOne({where: {user1:user.id, user2: friend.id}})
            let pk
            if(!talk){
                const substitute = await Talk.findOne({where: {user1:friend.id, user2: user.id}})
                pk = `${substitute.user1} ${substitute.user2}`
            }
            else{
                pk = `${talk.user1} ${talk.user2}`
            }
            res.render('chat/talk', {session: req.session,friend,user, pk})        
    }
}