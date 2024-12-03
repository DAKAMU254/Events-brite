import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="container">
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p className="col-md-4 mb-0 text-muted">&copy; 2022 Baruch, Inc</p>

    <Link to="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
     
    </Link>

    <ul className="nav col-md-4 justify-content-end">
      <li className="nav-item"><Link to="/" className="nav-link px-2 text-muted">Home</Link></li>
      <li className="nav-item"><Link to="Contact" className="nav-link px-2 text-muted">Contact</Link></li>
      <li className="nav-item"><Link to="Profile" className="nav-link px-2 text-muted">Profile</Link></li>
      <li className="nav-item"><Link to="#" className="nav-link px-2 text-muted">FAQs</Link></li>
      <li className="nav-item"><Link to="#" className="nav-link px-2 text-muted">About us</Link></li>
    </ul>
  </footer>
</div>

  );
}

export default Footer