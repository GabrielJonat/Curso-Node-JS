const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')
const checkAuth = require('../helpers/auth').checkAuth
router.get('/add', ThoughtsController.createThought)
router.post('/add', ThoughtsController.createThoughtPost)
router.get('/dashboard', ThoughtsController.dashboard)
router.post('/delete/:id', ThoughtsController.deleteThought)
router.get('/edit/:id', ThoughtsController.editThought)
router.post('/edit/:id', ThoughtsController.editThoughtPost)
router.get('/', ThoughtsController.showThoughts)


module.exports = router 