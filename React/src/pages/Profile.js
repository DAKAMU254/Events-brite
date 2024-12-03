import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function Profile() {
    const {current_user} = useContext(AuthContext)

  return (
    <div>
        <body className='bg-light' style={{"min-height": "70vh"}}>
            <div className='container'>
                <div className='row d-flex justify-content-center'>
                    <div className='col-md-10 mt-5 pt-5'>
                        <div className='row z-depth-3'>
                            <div className='col-sm-4 bg-info rounded-left'>
                                <div className='card-block text-center text-white'>
                                    <i className='fas fa-user-tie fa-7x mt-5'></i>
                                    <h2 className='fw-bold mt-4'>  Hello {current_user && current_user.username}</h2>
                                    <p>Event lover??</p>
                                    <i className='far fa-edit fa-2x mb-4'></i>
                                </div>
                            </div>
                            <div className='col-sm-8 bg-white rounded-right'>
                                <h3 className='mt-3 text-center'>Information</h3>
                                <hr className='badge-primary mt-0 w-100'/>
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <p className='fw-bold'>Email:</p>
                                        <h6 className='text-muted'>{current_user && current_user.email}</h6>
                                    </div>
                                    <div className='col-sm-6'>
                                        <p className='fw-bold'>Username:</p>
                                        <h6 className='text-muted'>{current_user && current_user.username}</h6>
                                    </div>
                                    <div className='col-sm-6'>
                                        <p className='fw-bold'>Joined on:</p>
                                        <h6 className='text-muted'>{current_user && current_user.created_at}</h6>
                                    </div>
                                    <div className='col-sm-6'>
                                        <p className='fw-bold'>Phone Number:</p>
                                        <h6 className='text-muted'>0{current_user && current_user.telephone}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </div>
  )
}

export default Profile