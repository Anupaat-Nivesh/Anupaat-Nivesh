import React, { useEffect, useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link, NavLink } from 'react-router-dom';
import { Link as LinkS, animateScroll as scroll } from 'react-scroll';
import logo from '../../assets/logo.png';

const links = [
    {
        name: "Home",
        path: '/home',
        id: 'home'

    },

    {
        name: "About",
        path: '/about',
        id: 'about'
    },
    {
        name: "WhyAnupaat",
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
        scroll.scrollToTop();
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
                        links.map(({ name, id }) => {
                            return (
                                <li>
                                    <LinkS className="nav-link" to={id} smooth={true} exact='true' offset={-80} spy={true}>{name}  </LinkS></li>
                            )
                        })
                    }
                </ul>

            </div>
            <div className="anupaat__navbar-sign">

                <a href="#ourapp">
                    <button type="button app-btn">GET THE APP</button>

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

                            <button type="button">Download</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Navbar