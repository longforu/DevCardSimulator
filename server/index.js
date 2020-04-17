const express = require('express')
const http = require('http')
const app = new express
const server = http.createServer(app)
require('dotenv').config()
app.use(require('helmet')())
app.use(require('morgan')('common'))
app.use(require('cors')())
app.use(require('compression')())
app.use(require('body-parser')())
require('mongoose').connect(process.env.MONGODB_URI,()=>console.log('Connected'))
require('./socket')(server)

const {Deck,addPlayer} = require('./model/deck')
const jwt = require('jsonwebtoken')

const handleSignIn = async (req,res,next)=>{
    const id = req.id
    console.log(id)
    const username = req.body.username
    const playerid = await addPlayer(id,username)
    console.log(id,username,playerid)
    return res.send({token:jwt.sign({id,playerid},process.env.SECRET_KEY) , id,playerid})
}

app.post('/create',async (req,res,next)=>{
    const deck = new Deck()
    await deck.save()
    req.id = deck._id
    next()
},handleSignIn)

app.post('/join',(req,res,next)=>{
    console.log(req.body)
    req.id = req.body.id
    next()
},handleSignIn)

const port = process.env.PORT || 4000
server.listen(port,()=>console.log(`Listening on port ${port}`))