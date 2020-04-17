import React, { useState } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {Formik,Form} from 'formik'
const {create} = require('../api')

const Landing = withRouter(connect(null,dispatch=>({dispatch}))(({dispatch,history})=>{
    const [loading,setLoading] = useState(false)

    const createGame = async ({username})=>{
        setLoading(true)
        const {data} = await create(username)
        const {token,id,playerid} = data
        dispatch({type:'LOG_IN',token,id,playerid})
        setLoading(false)
    }

    return (
        <div className='container'>
            {!loading &&
                <div className='text-center'>
                    <h1>Dev Card Simulator</h1>
                    <div className='text-secondary'>Created by Long Tran</div>
                    <div className='pt-5 pb-5 mt-5' style={{boxShadow:'0px 4px 16px rgba(31, 31, 31, 0.16)'}}>
                        <Formik initialValues={{username:''}} onSubmit={createGame}>
                            {({handleSubmit,handleChange,handleBlur})=>(
                                <Form>
                                    <div className = 'container w-75'>
                                        <label className='font-weight-bold'>Name:</label>
                                        <input type='text' name='username' className='form-control' onChange={handleChange} onBlur={handleBlur}/>
                                        <button className='btn btn-success mt-4' onSubmit={handleSubmit}>Create game</button>
                                    </div>
                                </Form>
                            )}                            
                        </Formik>
                    </div>
                </div>
            }
            <div style={{position:'absolute',top:'50%',width:'100%'}}>
                <BarLoader color='blue' loading={loading} width='200px' css={{margin:'auto'}}/>
            </div>
        </div>
    )
}))
export default Landing