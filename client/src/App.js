import React,{useEffect} from 'react';
import './App.css';
import {Provider,connect} from 'react-redux'
import {BrowserRouter as Router,Switch,Link,Route,useLocation,withRouter} from 'react-router-dom'
import Store from './redux'
import Game from './Page/Game';
import Join from './Page/Join';
import Landing from './Page/Landing';
import 'bootstrap/dist/css/bootstrap.min.css'

const Content = withRouter(connect(({loggedIn,joined})=>({loggedIn,joined}),(dispatch)=>({dispatch}))(({loggedIn,dispatch,history,joined})=>{
    const {pathname} = useLocation()
    useEffect(()=>{
      console.log('pathname',pathname)
      if(pathname.match(/join/) && !joined){
        dispatch({type:'LOG_OUT'})
        const tempJoinId = pathname.split('/')[2]
        console.log(tempJoinId)
        dispatch({type:'SET_TEMP_JOIN',tempJoinId})
        history.push('/join')
      }
      else if(loggedIn){
        console.log('hello')
        if(!pathname.match(/game/)) history.push('/game')
      }
      else history.push('/')
    },[loggedIn,joined])

    return(
      <Switch>
        <Route path='/game' exact component={Game}/>
        <Route path='/join' exact>
          <Join changeHistory={history}/>
        </Route>
        <Route path='/'exact component={Landing}/>
      </Switch>
    )
}))

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Content/>
      </Router>
    </Provider>
  );
}

console.log = ()=>{}

export default App;
