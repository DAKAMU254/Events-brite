import React, { useContext, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { EventContext } from '../../context/EventContext'

function AddEvent() {

  const {user} = useAuth()
  const {AddEvent} = useContext(EventContext)

  const [title, setTitle] = useState()
  const [image, setImage] = useState()
  const [description, setDescription] = useState()

  const  handleSubmit = (e) =>{
    e.preventDefault()

    AddEvent(title, image, description, user.id)
}

  return (

    <div>
    <div className="container" style={{"min-height":"70vh"}}>
      {user && user?
      <>
        
        <div class="col-md-10 mx-auto col-lg-5">
        <h3 className='text-center'>Add Event</h3>
        <form class="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>
          <div class="form-floating mb-3">
            <input type="text" onChange={(e)=> setTitle(e.target.value)} class="form-control" id="floatingInput" placeholder=""/>
            <label for="floatingInput">Title</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" onChange={(e)=> setImage(e.target.value)} class="form-control" id="floatingInput" placeholder=""/>
            <label for="floatingInput">Image</label>
          </div>
          <div class="form-floating  mb-3">
            <input type="text" onChange={(e)=> setDescription(e.target.value)} class="form-control" id="floatingInput" placeholder=""/>
            <label for="floatingInput">Description</label>
          </div>
          <button class="w-100 btn btn-lg btn-info" type="submit">Add Event</button>
          <hr class="my-4"/>
          <small class="text-muted">By clicking Add Event, you agree to the terms of use.</small>
        </form>
      </div>
    
    </>
    : 
    <>
<div class="modal modal-alert position-static d-block  py-5" tabindex="-1" role="dialog" id="modalChoice">
  <div class="modal-dialog" role="document">
    <div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center shadow">
        <h5 class="mb-0">Wan't to access this Page?</h5>
        <p class="mb-0">Unauthorised user!</p>
      </div>
      <div class=" btn-group modal-footerflex-nowrap p-0">
        <Link to='/signup' type="button" class="  text-white btn btn-lg btn-info fs-6 text-decoration-none col-6 m-0 rounded-0 border-end"><strong>Sign up</strong></Link>
        <Link to='/login' type="button" class="  text-white  btn btn-lg btn-info fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal"><strong>Log in</strong></Link>
      </div>
    </div>
  </div>
</div>
    
    </>
   
  }
   </div>
    </div>
  )
}

export default AddEvent