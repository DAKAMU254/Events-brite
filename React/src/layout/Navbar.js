
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className='bg-white '>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              {/* <Calendar className='h-8 w-8 text-blue-600' /> */}
              <img
                width='48'
                height='48'
                src='https://img.icons8.com/pulsar-color/48/event-accepted.png'
                alt='event-accepted'
              />
              <span className='font-bold text-xl text-gray-900'>
                EventsBrite
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className='hidden md:flex items-center space-x-4'>
            <Link
              to='/'
              className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to='/AddEvent'
                  className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Add Event
                </Link>
                <Link
                  to='/Profile'
                  className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors'
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/AddEvent'
                  className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Add Event
                </Link>
                <Link
                  to='/signup'
                  className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Sign Up
                </Link>
                <Link
                  to='/login'
                  className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors'
                >
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={toggleMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none'
            >
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          <Link
            to='/'
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to='/AddEvent'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              >
                Add Event
              </Link>
              <Link
                to='/Profile'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              >
                Profile
              </Link>
              <button
                onClick={()=>logout()}
                className='w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700'
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {/* <Link
                to='/AddEvent'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              >
                Add Event
              </Link> */}
              <Link
                to='/signup'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              >
                Sign Up
              </Link>
              <Link
                to='/login'
                className='block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700'
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
