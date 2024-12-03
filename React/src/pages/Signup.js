import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Signup() {

   const {signup} = useContext(AuthContext)

  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [telephone, setTelephone] = useState()
  const [image, setImage] = useState()

  const handleSubmit = (e) =>{
        e.preventDefault()
        // console.log(signup)
         signup(email, username, password, telephone, image)
  }
  return (
    <div>
     <div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 class="display-4 fw-bold lh-1 mb-3">Be Part of our <span className='text-info'>Family</span></h1>
        <p class="col-lg-10 fs-4">Your details are guaranteed to be protected and will not be altered by thirdparty applications</p>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <form class="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>     
          <div class="form-floating mb-3">
            <input type="email" onChange={(e)=> setEmail(e.target.value)} class="form-control" id="floatingInput" placeholder="name@example.com"/>
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" onChange={(e)=> setUsername(e.target.value)} class="form-control" id="floatingInput" placeholder="Username"/>
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" onChange={(e)=> setPassword(e.target.value)} class="form-control" id="floatingPassword" placeholder="Password"/>
            <label for="floatingPassword">Password</label>
          </div>
          <div class="form-floating mb-3">
            <input type="integer" onChange={(e)=> setTelephone(e.target.value)} class="form-control" id="floatingInput" placeholder="07********"/>
            <label for="floatingInput">07********</label>
          </div>
          <div class="form-group mb-3">
            <label for="Profile-Picture">Profile image</label>
            <input type="file" onChange={(e)=> setImage(e.target.value)} class="form-control " id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
          </div> 
          <div class="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"/> Remember me
            </label>
          </div>
          <button class="w-100 btn btn-lg btn-info" type="submit">Sign up</button>
          <hr class="my-4"/>
          <small class="text-muted">By clicking Sign up, you agree to the terms of use. Have an Account?<Link to='/login'>log in</Link></small>
        </form>
      </div>
    </div>
  </div>
    </div>
  )
}

export default Signup