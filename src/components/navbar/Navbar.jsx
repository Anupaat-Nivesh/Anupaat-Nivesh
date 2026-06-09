import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { animateScroll } from 'react-scroll';
import 'animate.css';

import logo from '../../assets/logo.webp';

/** Core client paths — “What we do” */
const whatWeDoLinks = [
    { label: 'All offerings', path: '/offerings' },
    { label: 'Mutual funds', path: '/mutual-funds' },
    { label: 'Equity basket', path: '/equity-basket' },
    { label: 'Loan against securities', path: '/loan-against-securities' },
    { label: 'P2P lending', path: '/p2p-lending' },
    { label: 'Unlisted stocks', path: '/unlisted-stocks' },
    { label: 'Fixed deposits', path: '/fixed-deposits' },
    { label: 'Bonds', path: '/bonds' },
    { label: 'Book a session', path: '/book-session' },
    { label: 'Partner with us', path: '/partner-with-us' },
];

/** Insights & tools — app install lives in header only (no duplicate Our app / App download). */
const insightsLinks = [
    { label: 'MarketCompass', path: '/valuation', badge: 'Coming soon' },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Tools', path: '/tools' },
];

/** Company & trust — Contact lives here to keep the bar minimal (fintech pattern). */
const companyLinks = [
    { label: 'About', path: '/about' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Corporate corner', path: '/corporate' },
    { label: 'Contact', path: '/contact' },
];

const loginLinks = [
    { label: 'Investor Login', href: 'https://login.anupaatnivesh.com/client-login' },
    { label: 'Sub-broker Login', href: 'https://login.anupaatnivesh.com/broker-login' },
    { label: 'RM Login', href: 'https://login.anupaatnivesh.com/rm-login' },
];

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [anupaat__navbar, setNavbar] = useState(false);
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [showWhatWeDoMenu, setShowWhatWeDoMenu] = useState(false);
    const [showInsightsMenu, setShowInsightsMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [mobileWhatWeDoOpen, setMobileWhatWeDoOpen] = useState(false);
    const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
    const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
    const whatWeDoWrapRef = useRef(null);
    const insightsWrapRef = useRef(null);
    const companyWrapRef = useRef(null);
    const navRootRef = useRef(null);
    const location = useLocation();

    useLayoutEffect(() => {
        const syncNavHeight = () => {
            const el = navRootRef.current;
            const h = el?.getBoundingClientRect?.().height ?? 72;
            document.documentElement.style.setProperty('--navbar-height', `${Math.ceil(h)}px`);
        };
        syncNavHeight();
        window.addEventListener('resize', syncNavHeight);
        return () => {
            window.removeEventListener('resize', syncNavHeight);
            document.documentElement.style.removeProperty('--navbar-height');
        };
    }, []);

    const closeNavDropdowns = useCallback(() => {
        setShowWhatWeDoMenu(false);
        setShowInsightsMenu(false);
        setShowCompanyMenu(false);
    }, []);

    const restoreScrolling = () => {
        const htmlElement = document.documentElement;
        htmlElement.style.overflowY = '';
        htmlElement.style.overflow = '';
    };

    const disableScrolling = () => {
        const htmlElement = document.documentElement;
        htmlElement.style.overflowY = 'hidden';
    };

    const changeNav = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeNav);
        return () => window.removeEventListener('scroll', changeNav);
    }, []);

    useEffect(() => {
        if (!toggleMenu) {
            setShowLoginMenu(false);
            restoreScrolling();
        }
    }, [toggleMenu]);

    useEffect(() => {
        setShowLoginMenu(false);
        closeNavDropdowns();
        setMobileWhatWeDoOpen(false);
        setMobileInsightsOpen(false);
        setMobileCompanyOpen(false);
    }, [location.pathname, closeNavDropdowns]);

    useEffect(() => {
        const onDocMouseDown = (e) => {
            const t = e.target;
            if (whatWeDoWrapRef.current?.contains(t)) return;
            if (insightsWrapRef.current?.contains(t)) return;
            if (companyWrapRef.current?.contains(t)) return;
            closeNavDropdowns();
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [closeNavDropdowns]);

    const toggleHome = () => {
        animateScroll.scrollToTop();
    };

    const openOnlyMobile = (panel) => {
        if (panel === 'whatwedo') {
            setMobileInsightsOpen(false);
            setMobileCompanyOpen(false);
            setMobileWhatWeDoOpen((o) => !o);
        } else if (panel === 'insights') {
            setMobileWhatWeDoOpen(false);
            setMobileCompanyOpen(false);
            setMobileInsightsOpen((o) => !o);
        } else {
            setMobileWhatWeDoOpen(false);
            setMobileInsightsOpen(false);
            setMobileCompanyOpen((o) => !o);
        }
    };

    return (
        <div
            ref={navRootRef}
            className={anupaat__navbar ? 'anupaat__navbar active' : 'anupaat__navbar'}
        >
            <div className="anupaat__navbar-links">
                <div className="anupaat__navbar-links_logo">
                    <Link to="/" className="logo" onClick={toggleHome} aria-label="Anupaat Nivesh — Home">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <ul className="anupaat__navbar-links_container">
                    <li className="nav-item-with-dropdown" ref={whatWeDoWrapRef}>
                        <button
                            type="button"
                            className="nav-dropdown-trigger"
                            aria-expanded={showWhatWeDoMenu}
                            aria-haspopup="true"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowInsightsMenu(false);
                                setShowCompanyMenu(false);
                                setShowWhatWeDoMenu((v) => !v);
                            }}
                        >
                            What we do
                            <span className="nav-dropdown-chevron" aria-hidden>▾</span>
                        </button>
                        <div className={`navbar-dropdown ${showWhatWeDoMenu ? 'open' : ''}`} role="menu">
                            {whatWeDoLinks.map((l) => (
                                <Link
                                    key={l.path}
                                    to={l.path}
                                    role="menuitem"
                                    onClick={() => setShowWhatWeDoMenu(false)}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </li>
                    <li className="nav-item-with-dropdown" ref={insightsWrapRef}>
                        <button
                            type="button"
                            className="nav-dropdown-trigger"
                            aria-expanded={showInsightsMenu}
                            aria-haspopup="true"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowWhatWeDoMenu(false);
                                setShowCompanyMenu(false);
                                setShowInsightsMenu((v) => !v);
                            }}
                        >
                            Insights
                            <span className="nav-dropdown-chevron" aria-hidden>▾</span>
                        </button>
                        <div className={`navbar-dropdown ${showInsightsMenu ? 'open' : ''}`} role="menu">
                            {insightsLinks.map((l) => (
                                <Link
                                    key={l.path}
                                    to={l.path}
                                    role="menuitem"
                                    className={l.badge ? 'navbar-dropdown__link navbar-dropdown__link--with-badge' : undefined}
                                    onClick={() => setShowInsightsMenu(false)}
                                >
                                    <span className="navbar-dropdown__link-text">{l.label}</span>
                                    {l.badge ? (
                                        <span className="nav-item-badge nav-item-badge--dropdown" aria-label={l.badge}>
                                            {l.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            ))}
                        </div>
                    </li>
                    <li className="nav-item-with-dropdown" ref={companyWrapRef}>
                        <button
                            type="button"
                            className="nav-dropdown-trigger"
                            aria-expanded={showCompanyMenu}
                            aria-haspopup="true"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowWhatWeDoMenu(false);
                                setShowInsightsMenu(false);
                                setShowCompanyMenu((v) => !v);
                            }}
                        >
                            Company
                            <span className="nav-dropdown-chevron" aria-hidden>▾</span>
                        </button>
                        <div className={`navbar-dropdown ${showCompanyMenu ? 'open' : ''}`} role="menu">
                            {companyLinks.map((l) => (
                                <Link
                                    key={l.path}
                                    to={l.path}
                                    role="menuitem"
                                    onClick={() => setShowCompanyMenu(false)}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </li>
                </ul>
            </div>

            <div className="anupaat__navbar-actions">
                <div className="anupaat__navbar-sign nav-action__btn nav-action__btn--outline">
                    <Link to="/ourApp" className="nav-action__link">
                        <button type="button" onClick={() => setShowLoginMenu(false)}>
                            Get the app
                        </button>
                    </Link>
                </div>
                <div className="anupaat__navbar-signup nav-action__btn nav-action__btn--primary">
                    <Link to="/signup" className="nav-action__link">
                        <button type="button" onClick={() => setShowLoginMenu(false)}>
                            Sign up
                        </button>
                    </Link>
                </div>
                <div className="anupaat__navbar-login nav-action__btn nav-action__btn--outline">
                    <button
                        type="button"
                        onClick={() => setShowLoginMenu((prev) => !prev)}
                        aria-expanded={showLoginMenu}
                        aria-haspopup="true"
                    >
                        Log in
                    </button>
                    <div className={`login-dropdown ${showLoginMenu ? 'open' : ''}`}>
                        {loginLinks.map((link) => (
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
            </div>

            <div className="anupaat__navbar-menu">
                {toggleMenu ? (
                    <RiCloseLine
                        className="animate__animated animate__fadeIn"
                        color="#000"
                        size={32}
                        onClick={() => {
                            setToggleMenu((prev) => !prev);
                            restoreScrolling();
                        }}
                    />
                ) : (
                    <RiMenu3Line
                        className="animate__animated animate__fadeIn"
                        color="#000"
                        size={27}
                        onClick={() => {
                            setToggleMenu(true);
                            disableScrolling();
                        }}
                    />
                )}

                {toggleMenu && (
                    <>
                        <div
                            className="backdrop-blur"
                            onClick={() => {
                                setToggleMenu(false);
                                restoreScrolling();
                            }}
                        />
                        <div className="anupaat__navbar-menu_container">
                            <div className="mobile-menu-header">
                                <h3>Menu</h3>
                                <button
                                    type="button"
                                    className="mobile-menu-close"
                                    onClick={() => {
                                        setToggleMenu(false);
                                        restoreScrolling();
                                    }}
                                    aria-label="Close menu"
                                >
                                    <RiCloseLine size={24} />
                                </button>
                            </div>
                            <ul className="anupaat__navbar-menu_container-links">
                                <li>
                                    <NavLink
                                        to="/"
                                        onClick={() => {
                                            setToggleMenu(false);
                                            restoreScrolling();
                                        }}
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="mobile-submenu-item">
                                    <button
                                        type="button"
                                        className="mobile-submenu-header-btn"
                                        onClick={() => openOnlyMobile('whatwedo')}
                                        aria-expanded={mobileWhatWeDoOpen}
                                    >
                                        <span>What we do</span>
                                        <span className={`mobile-submenu-arrow ${mobileWhatWeDoOpen ? 'open' : ''}`}>▾</span>
                                    </button>
                                    <ul className={`mobile-submenu ${mobileWhatWeDoOpen ? 'open' : ''}`}>
                                        {whatWeDoLinks.map((l) => (
                                            <li key={l.path}>
                                                <NavLink
                                                    to={l.path}
                                                    onClick={() => {
                                                        setToggleMenu(false);
                                                        restoreScrolling();
                                                    }}
                                                >
                                                    {l.label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mobile-submenu-item">
                                    <button
                                        type="button"
                                        className="mobile-submenu-header-btn"
                                        onClick={() => openOnlyMobile('insights')}
                                        aria-expanded={mobileInsightsOpen}
                                    >
                                        <span>Insights</span>
                                        <span className={`mobile-submenu-arrow ${mobileInsightsOpen ? 'open' : ''}`}>▾</span>
                                    </button>
                                    <ul className={`mobile-submenu ${mobileInsightsOpen ? 'open' : ''}`}>
                                        {insightsLinks.map((l) => (
                                            <li key={l.path}>
                                                <NavLink
                                                    to={l.path}
                                                    className={l.badge ? 'mobile-nav-link--with-badge' : undefined}
                                                    onClick={() => {
                                                        setToggleMenu(false);
                                                        restoreScrolling();
                                                    }}
                                                >
                                                    <span>{l.label}</span>
                                                    {l.badge ? (
                                                        <span className="nav-item-badge nav-item-badge--mobile">{l.badge}</span>
                                                    ) : null}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mobile-submenu-item">
                                    <button
                                        type="button"
                                        className="mobile-submenu-header-btn"
                                        onClick={() => openOnlyMobile('company')}
                                        aria-expanded={mobileCompanyOpen}
                                    >
                                        <span>Company</span>
                                        <span className={`mobile-submenu-arrow ${mobileCompanyOpen ? 'open' : ''}`}>▾</span>
                                    </button>
                                    <ul className={`mobile-submenu ${mobileCompanyOpen ? 'open' : ''}`}>
                                        {companyLinks.map((l) => (
                                            <li key={l.path}>
                                                <NavLink
                                                    to={l.path}
                                                    onClick={() => {
                                                        setToggleMenu(false);
                                                        restoreScrolling();
                                                    }}
                                                >
                                                    {l.label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                            <p className="mobile-menu-footer-note">
                                Products under What we do · MarketCompass &amp; tools under Insights · About, FAQs &amp; contact under Company. App: Get the app above.
                            </p>
                            <div className="anupaat__navbar-menu_container-links-sign">
                                <NavLink
                                    to="/signup"
                                    onClick={() => {
                                        setToggleMenu(false);
                                        restoreScrolling();
                                    }}
                                    className="mobile-signup-link"
                                >
                                    <button type="button" className="mobile-signup-btn">
                                        Sign up
                                    </button>
                                </NavLink>
                                <NavLink
                                    to="/ourApp"
                                    onClick={() => {
                                        setToggleMenu(false);
                                        restoreScrolling();
                                    }}
                                >
                                    <button type="button">Get the app</button>
                                </NavLink>
                                <div className="mobile-login-links">
                                    <p>Log in</p>
                                    {loginLinks.map((link) => (
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
        </div>
    );
};

export default Navbar;
