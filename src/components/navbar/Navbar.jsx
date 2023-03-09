import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';

const links = [
    {
        name: "Home",
        path: '/home'
    },

    {
        name: "About",
        path: '/about'
    },
    {
        name: "WhyAnupaat",
        path: '/whyanupaat'
    },
    {
        name: "Offerings",
        path: '/offerings'
    },
    {
        name: "Contact",
        path: '/contact'
    },
]

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
        <div className="anupaat__navbar">
            <div className="anupaat__navbar-links">
                <div className="anupaat__navbar-links_logo">
                    <Link to="/home" className='logo' onClick={() => setToggleMenu(false)}>
                        <img src={logo} alt="Anupaat Nivesh Logo" />
                    </Link>
                </div>
                <ul className="anupaat__navbar-links_container">
                    {
                        links.map(({ name, path }, index) => {
                            return (
                                <li>
                                    <NavLink className="nav-link" to={path}>{name}</NavLink>
                                </li>
                            )
                        })
                    }
                </ul>

            </div>
            <div className="anupaat__navbar-sign">
                <a href="https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh" target="_blank" rel="noreferrer">
                    <button type="button app-btn">Get The App</button>
                </a>
            </div>

            <div className="anupaat__navbar-menu">
                {toggleMenu
                    ? <RiCloseLine color="#000" size={27} onClick={() => setToggleMenu(prev => !prev)} />
                    : <RiMenu3Line color="#000" size={27} onClick={() => setToggleMenu(true)} />}
                {toggleMenu && (
                    <div className="anupaat__navbar-menu_container scale-up-center">
                        <ul className="anupaat__navbar-menu_container-links">
                            {
                                links.map(({ name, path }, index) => {
                                    return (
                                        <li>
                                            <NavLink to={path} onClick={() => setToggleMenu(prev => !prev)} >{name}</NavLink>
                                        </li>
                                    )
                                })
                            }

                        </ul>
                        <div className="anupaat__navbar-menu_container-links-sign">

                            <button type="button">Get The App</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Navbar