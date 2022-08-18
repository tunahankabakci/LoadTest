const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = express.Router()


router.post('/users/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user,token})
    } catch (error) {
        res.status(409).send({error:"User already exist."})
    }
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(401).send({error: 'Login failed! Check authentication credentials'})
    }
})

router.get('/users/profile', auth, async(req, res) => {
    try{
        res.send(req.user)
    } catch (error){
        res.status(401).send({error: 'Unauthorized'})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router