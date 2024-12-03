import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Login() {

  const {login}= useContext(AuthContext)

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const handleSubmit = (e) =>{
        e.preventDefault()
        
        login(email, password)

  }
  return (
    <div>
     <div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
  
        <h2 class="display-4 fw-bold lh-1 mb-3">Welcome back <span className='text-info'>Friend</span></h2>
        <p class="col-lg-10 fs-4">Are you ready to continue your experience with us?</p>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <form class="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>
          <div class="form-floating mb-3">
            <input type="email" onChange={(e)=> setEmail(e.target.value)} class="form-control" id="floatingInput" placeholder="name@example.com"/>
            <label for="floatingInput">Email address</label>
          </div>
          
          <div class="form-floating mb-3">
            <input type="password" onChange={(e)=> setPassword(e.target.value)} class="form-control" id="floatingPassword" placeholder="Password"/>
            <label for="floatingPassword">Password</label>
          </div>
          <button class="w-100 btn btn-lg btn-info" type="submit">Dive back in</button>
          <hr class="my-4"/>
          <small class="text-muted">Don't have an Account? <Link to='/signup'>Sign up?</Link></small>
        </form>
      </div>
    </div>
  </div>
    </div>
  )
}

export default Login