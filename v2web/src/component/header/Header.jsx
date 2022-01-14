import React, { useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-scroll'; // for scroll
import { useUser } from '../common/UserContext';

const Header = (props) => {
    const { user } = useUser();
    const history = useHistory();

    useEffect(() => {
        window.addEventListener('load', function () {
            console.log('All assets are loaded');
        });
    }, []);

    const signinToDashboard = async () => {
        console.log('current user header', user);

        if (user) {
            // redirect to dashboard
            history.push('/dashboard');
        } else {
            window.location.href = process.env.REACT_APP_DISCORD_OAUTH_URL;
        }
    };

    const menuTrigger = () => {
        document.querySelector('.header-wrapper').classList.toggle('menu-open');
    };

    const CLoseMenuTrigger = () => {
        document.querySelector('.header-wrapper').classList.remove('menu-open');
    };

    var elements = document.querySelectorAll('.has-droupdown > a');
    for (var i in elements) {
        if (elements.hasOwnProperty(i)) {
            elements[i].onclick = function () {
                this.parentElement.querySelector('.submenu').classList.toggle('active');
                this.classList.toggle('open');
            };
        }
    }

    const { color = 'default-color' } = props;
    let logoUrl = <img src="/assets/images/dynasty/logo-horizontal-dark.png" alt="Dynasty" />;

    return (
        <header className={`header-area header--fixed formobile-menu header--transparent ${color}`}>
            <div className="header-wrapper" id="header-wrapper">
                <div className="header-left">
                    <div className="logo">
                        <a href="/">{logoUrl}</a>
                    </div>
                </div>
                <div className="header-right">
                    <nav className="mainmenunav d-lg-block">
                        <ul className="mainmenu">
                            <li>
                                <Link to="Home" spy={true} smooth={true} href="#Home">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="Services" spy={true} smooth={true} href="#Services">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="Show" spy={true} smooth={true} href="#Show">
                                    Showcase
                                </Link>
                            </li>
                            <li>
                                <Link to="Sites" spy={true} smooth={true} href="#Sites">
                                    Sites
                                </Link>
                            </li>
                            <li>
                                <Link to="FAQ" spy={true} smooth={true} href="#FAQ">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="Contact" spy={true} smooth={true} href="#Contact">
                                    Contact
                                </Link>
                            </li>
                            {/* <li><Link to="/dark-main-demo">Main Demo Dark</Link></li> */}
                        </ul>
                    </nav>
                    <div className="header-btn">
                        {/* <a className="btn-default btn-border btn-opacity" href={process.env.REACT_APP_DISCORD_OAUTH_URL}>
                            Dashboard
                        </a> */}

                        <button className="btn-default btn-border btn-opacity" onClick={signinToDashboard}>
                            Dashboard
                        </button>

                        {/* <a className="btn-default btn-border btn-opacity" target="_blank" href="/dashboard">
                                
                            </a> */}
                    </div>
                    {/* Start Humberger Menu  */}
                    <div className="humberger-menu d-block d-lg-none pl--20 pl_sm--10">
                        <span onClick={menuTrigger} className="menutrigger text-white">
                            <FiMenu />
                        </span>
                    </div>
                    {/* End Humberger Menu  */}
                    <div className="close-menu d-block d-lg-none">
                        <span onClick={CLoseMenuTrigger} className="closeTrigger">
                            <FiX />
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;
