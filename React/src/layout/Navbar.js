import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-white  '>
        <div className='container '>
          <Link className='navbar-brand fw-bold' to='/'>
            <img
              width='48'
              height='48'
              src='https://img.icons8.com/pulsar-color/48/event-accepted.png'
              alt='event-accepted'
            />
            EventsBrite
          </Link>

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0 p-3'>
              <li className='nav-item'>
                <Link
                  to='/'
                  className='nav-link active fw-bold'
                  aria-current='page'
                >
                  HOME
                </Link>
              </li>

              {user && user ? (
                <>
                  <li className='nav-item'>
                    <Link
                      to='AddEvent'
                      className='nav-link active fw-bold'
                      tabindex='-1'
                      aria-disabled='true'
                    >
                      ADD EVENT
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      to='Profile'
                      className='nav-link active fw-bold'
                      tabindex='-1'
                      aria-disabled='true'
                    >
                      PROFILE
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-info'
                      onClick={() => logout()}
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className='nav-item'>
                    <Link
                      to='AddEvent'
                      className='nav-link active fw-bold'
                      tabindex='-1'
                      aria-disabled='true'
                    >
                      ADD EVENT
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      to='signup'
                      className='nav-link active fw-bold'
                      tabindex='-1'
                      aria-disabled='true'
                    >
                      SIGN UP
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      to='login'
                      className='nav-link active fw-bold'
                      tabindex='-1'
                      aria-disabled='true'
                    >
                      LOG IN
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
