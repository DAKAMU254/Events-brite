import  { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link, useParams } from "react-router-dom";
import { useEvents } from "../../context/event-context";

function EditEvent() {
  const { user } = useAuth();
  const { editEvent } = useEvents()

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const { id } = useParams();
  console.log(id);

  const handleSubmit = (e) => {
    e.preventDefault();

    editEvent(id, title, image, description, user.id);
  };

  return (
    <div>
      <div className='container' style={{ "min-height": "70vh" }}>
        {user && user ? (
          <>
            <div className='col-md-10 mx-auto col-lg-5'>
              <h3 className='text-center'> Edit / Update Event </h3>
              <form
                className='p-4 p-md-5 border rounded-3 bg-light'
                onSubmit={handleSubmit}
              >
                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    onChange={(e) => setTitle(e.target.value)}
                    className='form-control'
                    id='floatingInput'
                    placeholder=''
                  />
                  <label htmlFor='floatingInput'>Title</label>
                </div>
                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    onChange={(e) => setImage(e.target.value)}
                    className='form-control'
                    id='floatingInput'
                    placeholder=''
                  />
                  <label htmlFor='floatingInput'>Image</label>
                </div>
                <div className='form-floating  mb-3'>
                  <input
                    type='text'
                    onChange={(e) => setDescription(e.target.value)}
                    className='form-control'
                    id='floatingInput'
                    placeholder=''
                  />
                  <label htmlFor='floatingInput'>Description</label>
                </div>
                <button className='w-100 btn btn-lg btn-info' type='submit'>
                  Update Event
                </button>
                <hr className='my-4' />
                <small className='text-muted'>
                  By clicking Update Event, you agree to the terms of use.
                </small>
              </form>
            </div>
          </>
        ) : (
          <>
            <div
              className='modal modal-sheet position-static d-block  py-5'
              tabIndex='-1'
              role='dialog'
              id='modalSheet'
            >
              <div className='modal-dialog shadow' role='document'>
                <div className='modal-content rounded-6 shadow'>
                  <div className='modal-header border-bottom-0 '>
                    <h5 className='modal-title '>Access Denied</h5>
                    <button
                      type='button '
                      className='btn-close'
                      data-bs-dismiss='modal'
                      aria-label='Close'
                    ></button>
                  </div>
                  <div className='modal-body py-0 '>
                    <p>
                      You are required to register an account or sign in to
                      access the contents of this page
                    </p>
                  </div>
                  <div className='modal-footer flex-column border-top-0'>
                    <Link
                      to='/signup'
                      type='button'
                      className='btn btn-lg btn-info w-100 mx-0 mb-2'
                    >
                      Sign up
                    </Link>
                    <Link
                      to='/login'
                      type='button'
                      className='btn btn-lg btn-info w-100 mx-0'
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditEvent;
