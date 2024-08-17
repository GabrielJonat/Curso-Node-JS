const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/logout', AuthController.logout)
router.get('/register', AuthController.register)
router.post('/register', AuthController.postRegister)
router.post('/resetPassword/:email', AuthController.resetPassword)
router.get('/resetPassword', AuthController.generateToken)

module.exports = router