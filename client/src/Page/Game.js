import React, { useEffect, useState, useRef } from 'react'
import {connect} from 'react-redux'
import BarLoader from 'react-spinners/BarLoader'
import cogoToast from 'cogo-toast'
const io = require('socket.io-client')

const Game = connect(({token,id,playerid})=>({token,id,playerid}),dispatch=>({dispatch}))(({token,id,playerid,dispatch})=>{
    const [Deck,setDeck] = useState(null)
    const [loading,setLoading] = useState(false)
    const socketRef = useRef(null)

    const update = (deck)=>{
        console.log(deck)
        setDeck(deck)
        setLoading(false)
    }

    const draw = ()=>{
        socketRef.current.emit('Draw')
    }
    
    const play = (card)=>{
        console.log(card)
        socketRef.current.emit('Play',card)
    }

    useEffect(()=>{
        setLoading(true)
        const url = (process.env.NODE_ENV==='production')?'/':'http://localhost:4000'
        const socket = io.connect(url,{query:{token}})
        socketRef.current = socket
        socket.on('Update',update)
        setLoading(true)
    },[])
    const tf = (!loading && !!Deck)
    let myDeck = []
    console.log(Deck,id,playerid)
    if(Deck && !(!playerid && playerid!==0) && id){
        const deck = Deck.players[playerid].cards
        for(let card of deck){
            const index = myDeck.findIndex(e=>e[0]===card)
            if(index===-1) myDeck.push([card,1])
            else myDeck[index][1]++
        }
    }
    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        cogoToast.success('Copied!')
    };
    if((!playerid && playerid!==0) || (!id)) return (<></>)
    const url = `http://localhost:3000/join/${id}`
    return (
        <div className='container'>
            {tf&&
                <>
                    <div>
                        <h1>Dev Card Simulator</h1>
                        Invite Link ➡️: <a href={url}>{url}</a> 
                        <div href='/' className='border rounded d-inline ml-2' style={{padding:'5px',cursor:'pointer'}} onClick={e=>{e.preventDefault();copyToClipboard(url)}}>Copy</div>
                    </div>
                    <hr/>
                    <div>
                    <p className='font-weight-bold'>Current Players 👨‍💻</p>
                        <span> {Deck.playerUsername.join(', ')}</span>
                    </div>
                    <hr/>
                    <div>
                    <p className='font-weight-bold'>Deck 📚</p>
                        <div>There are {Deck.cards.length} cards left in the deck</div>
                        <a href='/' onClick={(e)=>{e.preventDefault();draw()}}>Draw</a>
                    </div>
                    <hr/>
                    <div>
                        <p className='font-weight-bold'>Your Cards 🃏</p>
                        {(Deck.players[playerid].cards.length !== 0)&&
                            <>
                                {    
                                myDeck.map(([card,amount])=>(
                                    <div key={card}>
                                        <span>{amount}x {card} </span>
                                        <a href='/' onClick={(e)=>{e.preventDefault();play(card)}}>Play this card</a>
                                    </div>
                               
                                ))}
                            </>
                        }
                        {(Deck.players[playerid].cards.length===0)&&
                            <div className='text-center'>
                                You have no card yet in your deck
                            </div>
                        }
                    </div>
                    <hr/>
                    <div>
                        <p className='font-weight-bold'>Feed 📜</p>
                        {Deck.feed.slice(0,10).map((e,i)=>(
                            <div key={i}>
                                {e}
                            </div>
                        ))}
                    </div>
                    <hr/>
                    <a href='/' onClick={e=>{e.preventDefault();dispatch({type:'LOG_OUT'})}} className='text-danger'>Log Out</a>
                    <p className='font-weight-bold'>Like this app? Buy me a beer on Venmo @LongTran123</p>
                </>
            }
            <div style={{position:'absolute',top:'50%',width:'100%'}}>
                <BarLoader color='blue' loading={loading} width='200px' css={{margin:'auto'}}/>
            </div>
        </div>
    )
})
export default Game