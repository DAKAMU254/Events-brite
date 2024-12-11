import React from 'react';
import { Link } from 'react-router-dom';
import {
    SignedIn,
    SignedOut,
    UserButton,
    SignInButton,
    SignUpButton
} from "@clerk/clerk-react";
import { IconCalendarCheck, IconMenu, IconX } from '@tabler/icons-react';

function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 group"
                        >
                            {/* <img
                                width='48'
                                height='48'
                                src='https://img.icons8.com/pulsar-color/48/event-accepted.png'
                                alt='event-accepted'
                                className='group-hover:rotate-12 transition-transform'
                            /> */}

                            <IconCalendarCheck className="h-8 w-8 text-blue-600 group-hover:rotate-12 transition-transform" />
                            <span className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                EventsBrite
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Home
                        </Link>

                        <SignedIn>
                            <Link
                                to="/addevent"
                                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Add Event
                            </Link>
                            <Link
                                to="/profile"
                                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Profile
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <SignedOut>
                            <SignUpButton mode="modal">
                                <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Sign Up
                                </button>
                            </SignUpButton>
                            <SignInButton mode="modal">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                    Log In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? (
                                <IconX className="h-6 w-6 animate-rotate-in" />
                            ) : (
                                <IconMenu className="h-6 w-6 animate-rotate-out" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
                    <Link
                        to="/"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                        Home
                    </Link>

                    <SignedIn>
                        <Link
                            to="/addevent"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            Add Event
                        </Link>
                        <Link
                            to="/profile"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            Profile
                        </Link>
                        <div className="px-3 py-2">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <Link
                            to="/home"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            Home
                        </Link>
                        <SignUpButton mode="modal">
                            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                Sign Up
                            </button>
                        </SignUpButton>
                        <SignInButton mode="modal">
                            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                                Log In
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;