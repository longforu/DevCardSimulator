const {createStore} = require('redux')

const token = localStorage.getItem('token')
const id = localStorage.getItem('id')
const playerid = localStorage.getItem('playerid')
const username = localStorage.getItem('username')
const defaultState = {
    token,id,playerid,username,tempJoinID:null,joined:false,
    loggedIn:!!token,
}

const reducer = (state=defaultState,{id,playerid,token,type,username,tempJoinId})=>{
    switch(type){
        case 'LOG_IN':
            localStorage.setItem('token',token)
            localStorage.setItem('id',id)
            localStorage.setItem('playerid',playerid)
            localStorage.setItem('username',username)
            return {...state,id,playerid,token,loggedIn:true,username}
        case 'JOIN_LOG_IN':
            localStorage.setItem('token',token)
            localStorage.setItem('id',id)
            localStorage.setItem('playerid',playerid)
            localStorage.setItem('username',username)
            return {...state,id,playerid,token,loggedIn:true,username,joined:true}
        case 'LOG_OUT':
            localStorage.removeItem('token')
            localStorage.removeItem('id')
            localStorage.removeItem('playerid')
            localStorage.removeItem('username')
            return {...state,id:null,username:null,token:null,playerid:null,loggedIn:false}
        case 'SET_TEMP_JOIN':
            console.log(tempJoinId)
            return {...state,tempJoinId}
        case 'JOINED':
            return {...state,joined:true}
        default:
            return{...state}
    }
}

const Store = createStore(reducer)

export default Store