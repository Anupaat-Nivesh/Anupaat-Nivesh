import React, { useEffect, useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { animateScroll } from 'react-scroll';
import 'animate.css';

import logo from '../../assets/logo.webp';

const calculatorLinks = [
    { name: "SIP Calculator", path: '/calculators', tab: 'sip' },
    { name: "Step-up SIP", path: '/calculators', tab: 'step' },
    { name: "Lumpsum Calculator", path: '/calculators', tab: 'lumpsum' },
    { name: "Time Value (PV)", path: '/calculators', tab: 'pv' },
    { name: "SWP Calculator", path: '/calculators', tab: 'swp' },
    { name: "Retirement Planning", path: '/calculators', tab: 'retirement' },
    { name: "Child Education", path: '/calculators', tab: 'education' },
    { name: "Goal Planning", path: '/calculators', tab: 'goal' },
    { name: "Term Insurance", path: '/calculators', tab: 'term' },
    { name: "Home Loan", path: '/calculators', tab: 'homeloan' },
    { name: "EMI Calculator", path: '/calculators', tab: 'emi' },
    { name: "Inflation Calculator", path: '/calculators', tab: 'inflation' },
];

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
        name: "Calculators",
        path: '/calculators',
        id: 'calculators',
        hasSubmenu: true
    },
    {
        name: "Offerings",
        path: '/offerings',
        id: 'offerings'
    },
    {
        name: "Elemental",
        path: '/invest',
        id: 'elemental'
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
    const [showCalculatorMenu, setShowCalculatorMenu] = useState(false);
    const [showMobileCalculatorMenu, setShowMobileCalculatorMenu] = useState(false);
    const location = useLocation();
    
    // Helper function to restore scrolling
    const restoreScrolling = () => {
        const htmlElement = document.documentElement;
        htmlElement.style.overflowY = "";
        htmlElement.style.overflow = "";
    };
    
    // Helper function to disable scrolling
    const disableScrolling = () => {
        const htmlElement = document.documentElement;
        htmlElement.style.overflowY = "hidden";
    };
    
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
            // Restore scrolling when menu closes
            restoreScrolling();
        }
    }, [toggleMenu]);
    useEffect(() => {
        // Close login dropdown whenever the route changes
        setShowLoginMenu(false);
        setShowCalculatorMenu(false);
        setShowMobileCalculatorMenu(false);
        // Restore scrolling when route changes
        restoreScrolling();
    }, [location.pathname]);

    useEffect(() => {
        // Close mobile calculator menu when main menu closes
        if (!toggleMenu) {
            setShowMobileCalculatorMenu(false);
        }
    }, [toggleMenu]);
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
                        links.map(({ name, id, hasSubmenu }) => {
                            if (hasSubmenu) {
                                return (
                                    <li key={name} className="nav-item-with-dropdown">
                                        <button
                                            className="nav-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowCalculatorMenu(prev => !prev);
                                                setShowLoginMenu(false);
                                            }}
                                            onMouseEnter={() => setShowCalculatorMenu(true)}
                                        >
                                            {name} <span style={{ marginLeft: '0.3rem' }}>▼</span>
                                        </button>
                                        <div 
                                            className={`calculator-dropdown ${showCalculatorMenu ? 'open' : ''}`}
                                            onMouseLeave={() => setShowCalculatorMenu(false)}
                                        >
                                            {calculatorLinks.map(calc => (
                                                <Link
                                                    key={calc.tab}
                                                    to={`${calc.path}?tab=${calc.tab}`}
                                                    onClick={() => {
                                                        setShowCalculatorMenu(false);
                                                        setShowLoginMenu(false);
                                                    }}
                                                >
                                                    {calc.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </li>
                                );
                            }
                            return (
                                <li key={name} >
                                    <Link
                                        className="nav-link"
                                        to={id}
                                        exact='true'
                                        onClick={() => {
                                            setShowLoginMenu(false);
                                            setShowCalculatorMenu(false);
                                        }}
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
            <div className="anupaat__navbar-signup nav-action__btn nav-action__btn--primary">

                <Link to='/signup'>
                    <button type="button" onClick={() => setShowLoginMenu(false)}>
                        Sign Up
                    </button>
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
                        restoreScrolling();
                    }} />
                    : <RiMenu3Line className='animate__animated animate__fadeIn' color="#000" size={27} onClick={(event) => {
                        setToggleMenu(true);
                        disableScrolling();
                    }} />}



                {toggleMenu && (
                    <>
                        <div 
                            className='backdrop-blur' 
                            onClick={(event) => {
                                setToggleMenu(false);
                                setShowMobileCalculatorMenu(false);
                                restoreScrolling();
                            }}
                        ></div>
                        <div className="anupaat__navbar-menu_container">
                            <div className="mobile-menu-header">
                                <h3>Menu</h3>
                                <button 
                                    className="mobile-menu-close"
                                    onClick={() => {
                                        setToggleMenu(false);
                                        setShowMobileCalculatorMenu(false);
                                        restoreScrolling();
                                    }}
                                    aria-label="Close menu"
                                >
                                    <RiCloseLine size={24} />
                                </button>
                            </div>
                            <ul className="anupaat__navbar-menu_container-links">
                                {
                                    links.map(({ name, path, hasSubmenu }) => {
                                        if (hasSubmenu) {
                                            return (
                                                <li key={name} className="mobile-submenu-item">
                                                    <button
                                                        className="mobile-submenu-header-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setShowMobileCalculatorMenu(prev => !prev);
                                                        }}
                                                        aria-expanded={showMobileCalculatorMenu}
                                                    >
                                                        <span>{name}</span>
                                                        <span className={`mobile-submenu-arrow ${showMobileCalculatorMenu ? 'open' : ''}`}>▼</span>
                                                    </button>
                                                    <ul className={`mobile-submenu ${showMobileCalculatorMenu ? 'open' : ''}`}>
                                                        {calculatorLinks.map(calc => (
                                                            <li key={calc.tab}>
                                                                <NavLink 
                                                                    to={`${calc.path}?tab=${calc.tab}`} 
                                                                    onClick={() => {
                                                                        setToggleMenu(false);
                                                                        setShowMobileCalculatorMenu(false);
                                                                        restoreScrolling();
                                                                    }}
                                                                >
                                                                    {calc.name}
                                                                </NavLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            );
                                        }
                                        return (
                                            <li key={name}>
                                                <NavLink 
                                                    to={path} 
                                                    onClick={() => {
                                                        setToggleMenu(false);
                                                        setShowMobileCalculatorMenu(false);
                                                        restoreScrolling();
                                                    }}
                                                >
                                                    {name}
                                                </NavLink>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="anupaat__navbar-menu_container-links-sign">
                                <NavLink to='/signup' onClick={() => {
                                    setToggleMenu(false);
                                    restoreScrolling();
                                }} className="mobile-signup-link">
                                    <button type="button" className="mobile-signup-btn">Sign Up</button>
                                </NavLink>
                                <NavLink to='ourApp' onClick={() => {
                                    setToggleMenu(false);
                                    restoreScrolling();
                                }}>
                                    <button type="button">GET THE APP</button>
                                </NavLink>
                                <div className="mobile-login-links">
                                    <p>Login</p>
                                    {loginLinks.map(link => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                setToggleMenu(false);
                                                restoreScrolling();
                                            }}
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div >

    );
};

export default Navbar;