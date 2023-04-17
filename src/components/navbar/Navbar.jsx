import React, { useEffect, useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link, NavLink } from 'react-router-dom';
import { animateScroll } from 'react-scroll';

import logo from '../../assets/logo.png';

const links = [
    {
        name: "Home",
        path: '/',
        id: ''
    },
    {
        name: "About",
        path: '/about',
        id: 'about'
    },
    {
        name: "Why Anupaat Nivesh",
        path: '/whyanupaat',
        id: 'whyanupaat'
    },
    {
        name: "Offerings",
        path: '/offerings',
        id: 'offerings'
    },
    {
        name: "Contact",
        path: '/contact',
        id: 'contact'

    },
]

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [anupaat__navbar, setNavbar] = useState(false);
    const changeNav = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        }
        else {
            setNavbar(false);
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', changeNav)
    }, []);


    /*On clicking the logo it will scroll to top*/
    const toggleHome = () => {
        animateScroll.scrollToTop();
    }
    return (
        <div className={anupaat__navbar ? 'anupaat__navbar active' : 'anupaat__navbar'}>
            <div className="anupaat__navbar-links">
                <div className="anupaat__navbar-links_logo">
                    <Link to="/" className='logo' onClick={toggleHome}>
                        <img src={logo} alt="Anupaat Nivesh Logo" />
                    </Link>
                </div>
                <ul className="anupaat__navbar-links_container">
                    {
                        links.map(({ name, id, }) => {
                            return (
                                <li key={id}>

                                    <Link className="nav-link" to={id} exact='true'>{name} </Link>

                                </li>
                            )
                        })
                    }
                </ul>

            </div>
            <div className="anupaat__navbar-sign">

                <Link to='ourApp'>
                    <button type="button">GET THE APP</button></Link>

            </div>

            <div className="anupaat__navbar-menu">
                {toggleMenu
                    ? <RiCloseLine color="#000" size={32} onClick={(event) => { setToggleMenu(prev => !prev); }} />
                    : <RiMenu3Line color="#000" size={27} onClick={(event) => {
                        setToggleMenu(true);
                    }} />}


                {toggleMenu && (
                    <div className="anupaat__navbar-menu_container scale-up-center">
                        <ul className="anupaat__navbar-menu_container-links">
                            {
                                links.map(({ name, path }) => {
                                    return (
                                        <li>
                                            <NavLink to={path} onClick={() => setToggleMenu(prev => !prev)} >{name}</NavLink>
                                        </li>
                                    )
                                })
                            }

                        </ul>
                        <div className="anupaat__navbar-menu_container-links-sign">
                            <NavLink to='ourApp' onClick={() => setToggleMenu(prev => !prev)}>
                                <button type="button">GET THE APP</button></NavLink>


                        </div>
                    </div>
                )}
            </div>
        </div >

    );
};

export default Navbar