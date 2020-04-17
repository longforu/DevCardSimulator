const jwt = require('jsonwebtoken')
const {Deck,drawCard,playCard,getFeed} = require('./model/deck')
module.exports = (server)=>{
    const io = require('socket.io')(server)

    io.on('connect',async (socket)=>{
        const draw = ()=>drawCard(socket.room,socket.playerid)
        const play = (card)=>playCard(socket.room,socket.playerid,card)

        const error = (message)=>socket.emit('error',message)
        const emitToAll = (message,data)=>io.to(socket.room).emit(message,data)
        const update = async ()=>{
            const deck = await Deck.findById(socket.room)
            emitToAll('Update',deck)
        }

        const {token} = socket.handshake.query
        const {id,playerid} = jwt.verify(token,process.env.SECRET_KEY)
        if(!id || (!playerid && playerid!==0)){
            error('Unauthorized')
            socket.disconnect()
        }
        socket.room = id
        socket.playerid = playerid
        socket.join(socket.room)
        const deck = await Deck.findById(socket.room)
        update()
        if(!deck){
            error('Game ended')
            socket.disconnect()
        }

        socket.on('Draw',async ()=>{
            await draw()
            update()
        })
        socket.on('Play',async (card)=>{
            await play(card)
            update()
        })
    })
}