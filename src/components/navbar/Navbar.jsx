import React, { useEffect, useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { animateScroll } from 'react-scroll';
import 'animate.css';

import logo from '../../assets/logo.webp';

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
        name: "Calculators",
        path: '/calculators',
        id: 'calculators'
    },
    {
        name: "Offerings",
        path: '/offerings',
        id: 'offerings'
    },
    /*{
        name: "Tools", // New heading
        path: '/tools', // Set the path for the Tools page
        id: 'tools' // Set the id for the Tools heading
    },*/
    {
        name: "Contact",
        path: '/contact',
        id: 'contact'
    },
];

const loginLinks = [
    //{ label: 'Admin Login', href: 'https://login.anupaatnivesh.com/arn-login' },
    { label: 'Investor Login', href: 'https://login.anupaatnivesh.com/client-login' },
    //{ label: 'Employee Login', href: 'https://login.anupaatnivesh.com/emp-login' },
    //{ label: 'Branch Login', href: 'https://login.anupaatnivesh.com/branch-login' },
    { label: 'Sub-broker Login', href: 'https://login.anupaatnivesh.com/broker-login' },
    { label: 'RM Login', href: 'https://login.anupaatnivesh.com/rm-login' },
];

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [anupaat__navbar, setNavbar] = useState(false);
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const location = useLocation();
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
    useEffect(() => {
        if (!toggleMenu) {
            setShowLoginMenu(false);
        }
    }, [toggleMenu]);
    useEffect(() => {
        // Close login dropdown whenever the route changes
        setShowLoginMenu(false);
    }, [location.pathname]);
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
                                <li key={name} >

                                    <Link
                                        className="nav-link"
                                        to={id}
                                        exact='true'
                                        onClick={() => setShowLoginMenu(false)}
                                    >
                                        {name}
                                    </Link>

                                </li>
                            )
                        })
                    }
                </ul>

            </div>
            <div className="anupaat__navbar-sign nav-action__btn">

                <Link to='ourApp'>
                    <button type="button" onClick={() => setShowLoginMenu(false)}>GET THE APP</button>
                </Link>

            </div>
            <div className="anupaat__navbar-login nav-action__btn">

                <button
                    type="button"
                    onClick={() => setShowLoginMenu(prev => !prev)}
                    aria-expanded={showLoginMenu}
                    aria-haspopup="true"
                >
                    Login
                </button>
                <div className={`login-dropdown ${showLoginMenu ? 'open' : ''}`}>
                    {loginLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setShowLoginMenu(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

            </div>




            {/* Mobile Navigation Modal */}

            <div className="anupaat__navbar-menu">
                {toggleMenu
                    ? <RiCloseLine className='animate__animated animate__fadeIn' color="#000" size={32} onClick={(event) => {
                        setToggleMenu(prev => !prev);
                        const htmlElementCollection = window.document.getElementsByTagName("html");
                        const htmlElement = Array.from(htmlElementCollection)[0];
                        htmlElement.style.overflowY = "scroll";
                    }} />
                    : <RiMenu3Line className='animate__animated animate__fadeIn' color="#000" size={27} onClick={(event) => {
                        setToggleMenu(true);
                        const htmlElementCollection = window.document.getElementsByTagName("html");
                        const htmlElement = Array.from(htmlElementCollection)[0];
                        htmlElement.style.overflowY = "hidden";
                    }} />}



                <div className='backdrop-blur' style={{ backdropFilter: `${toggleMenu ? 'blur(10px)' : 'blur(0)'}`, display: `${toggleMenu ? 'block' : 'none'}` }} onClick={(event) => {
                    setToggleMenu(prev => !prev);
                    const htmlElementCollection = window.document.getElementsByTagName("html");
                    const htmlElement = Array.from(htmlElementCollection)[0];
                    htmlElement.style.overflowY = "scroll";
                }}></div>
                <div className="anupaat__navbar-menu_container scale-up-center" style={{ transform: `${toggleMenu ? 'translate(0,0)' : 'translate(100%,0)'}` }}>
                    <ul className="anupaat__navbar-menu_container-links">
                        {
                            links.map(({ name, path }) => {
                                return (
                                    <li key={name}>
                                        <NavLink to={path} onClick={() => setToggleMenu(prev => !prev)} >{name}</NavLink>
                                    </li>
                                )
                            })
                        }

                    </ul>
                    <div className="anupaat__navbar-menu_container-links-sign">
                        <NavLink to='ourApp' onClick={() => setToggleMenu(prev => !prev)}>
                            <button type="button">GET THE APP</button></NavLink>

                        <div className="mobile-login-links">
                            <p>Login</p>
                            {loginLinks.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setToggleMenu(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>


                    </div>
                </div>

            </div>
        </div >

    );
};

export default Navbar;