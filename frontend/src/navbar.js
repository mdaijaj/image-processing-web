import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const cardata = localStorage.getItem("itemscart")
    console.log("cardata", cardata)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="#">
                        <img src="https://filterpixel.com/hubfs/raw_assets/public/Filterpixel%20Website%2023/Images/fpLogo.svg" width="150" height="40" className="d-inline-block align-top" alt="image path not found" />
                    </NavLink>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link active" aria-current="page" to="/">Home</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;