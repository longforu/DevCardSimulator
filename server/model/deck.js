const mongoose = require('mongoose')
const _ = require('lodash')
const ttl = require('mongoose-ttl')

const playerSchema = new mongoose.Schema({
    cards:{
        type:[String],
        default:[]
    }
})

const Player = mongoose.model('players',playerSchema)

const deckSchema = new mongoose.Schema({
    cards:{
        type:[String],
        default:[
            ...Array(14).fill('Soldiers'),
            ...Array(5).fill('Victory Points'),
            ...Array(2).fill('Monopoly'),
            ...Array(2).fill('Road Building'),
            ...Array(2).fill('Year of Plenty')
        ]
    },
    players:{
        type:[playerSchema],
        default:[]
    },
    playerUsername:{
        type:[String],
        default:[]
    },
    feed:{
        type:[String],
        default:[]
    }
})
deckSchema.plugin(ttl,{ttl:'2d'})

const Deck = mongoose.model('deck',deckSchema)

const gameFunctionFactory = (func)=>async (id,...args)=>{
    const game = await Deck.findById(id)
    console.log(id)
    if(!game) throw Error("Game is invalid")
    else return await func(game,...args)
}
const addPlayer = gameFunctionFactory(async (deck,username)=>{
    const id = deck.players.length
    deck.players.push(new Player())
    deck.playerUsername.push(username)
    deck.feed.unshift(`${username} joined the game`)
    await deck.save()
    return id
})

const drawCard =  gameFunctionFactory(async (deck,playerid)=>{
    const card = deck.cards.splice(_.random(deck.cards.length-1),1)[0]
    deck.players[playerid].cards.push(card)
    deck.feed.unshift(`${deck.playerUsername[playerid]} draw a card`)
    await deck.save()
    return card
})

const playCard = gameFunctionFactory(async (deck,playerid,card)=>{
    console.log(card)
    if(!deck.players[playerid].cards.includes(card)) throw Error("That card is not found")
    deck.players[playerid].cards.splice(deck.players[playerid].cards.indexOf(card),1)
    deck.feed.unshift(`${deck.playerUsername[playerid]} played ${card}`)
    await deck.save()
    return card
})

const getFeed = gameFunctionFactory(async (deck)=>deck.feed)

module.exports = {Deck,addPlayer,drawCard,playCard,getFeed}

