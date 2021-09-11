import React, { Component } from "react";
import { FiX , FiMenu } from "react-icons/fi";
import {Link} from 'react-scroll' // for scroll
import { Link as LinkTo } from 'react-router-dom' // for routes 


class Header extends Component{
    constructor(props) {
        super(props);
        this.menuTrigger = this.menuTrigger.bind(this);
        this.CLoseMenuTrigger = this.CLoseMenuTrigger.bind(this);
       //  this.subMetuTrigger = this.subMetuTrigger.bind(this);
        window.addEventListener('load', function() {
            console.log('All assets are loaded')
        })
    }

    menuTrigger() {
        document.querySelector('.header-wrapper').classList.toggle('menu-open')
    }
    CLoseMenuTrigger() {
        document.querySelector('.header-wrapper').classList.remove('menu-open');
    }
    render(){


        var elements = document.querySelectorAll('.has-droupdown > a');
        for(var i in elements) {
            if(elements.hasOwnProperty(i)) {
                elements[i].onclick = function() {
                    this.parentElement.querySelector('.submenu').classList.toggle("active");
                    this.classList.toggle("open");
                }
            }
        }
        
        const { color='default-color' } = this.props;
        let logoUrl = <img src="/assets/images/dynasty/logo-horizontal-dark.png" alt="Dynasty" />;
        
        return(
            <header className={`header-area header--fixed formobile-menu header--transparent ${color}`}>
                <div className="header-wrapper" id="header-wrapper">
                    <div className="header-left">
                        <div className="logo">
                            <a href="/">
                                {logoUrl}
                            </a>
                        </div>
                    </div>
                    <div className="header-right">
                        <nav className="mainmenunav d-lg-block">
                            <ul className="mainmenu">
                                <li><Link to="Home" spy={true} smooth={true} href="#Home">Home</Link></li>
                                <li><Link to="Services" spy={true} smooth={true} href="#Services">Services</Link></li>
                                <li><Link to="Show" spy={true} smooth={true} href="#Show">Showcase</Link></li>
                                <li><Link to="Sites" spy={true} smooth={true} href="#Sites">Sites</Link></li>
                                <li><Link to="FAQ" spy={true} smooth={true} href="#FAQ">FAQ</Link></li>
                                <li><Link to="Contact" spy={true} smooth={true} href="#Contact">Contact</Link></li>
                                {/* <li><Link to="/dark-main-demo">Main Demo Dark</Link></li> */}
                            </ul>
                        </nav>
                        <div className="header-btn">
                        <LinkTo className="btn-default btn-border btn-opacity" to="/dashboard"> <span>Dashboard</span> </LinkTo>
                            {/* <a className="btn-default btn-border btn-opacity" target="_blank" href="/dashboard">
                                
                            </a> */}
                        </div>
                        {/* Start Humberger Menu  */}
                        <div className="humberger-menu d-block d-lg-none pl--20 pl_sm--10">
                            <span onClick={this.menuTrigger} className="menutrigger text-white"><FiMenu /></span>
                        </div>
                        {/* End Humberger Menu  */}
                        <div className="close-menu d-block d-lg-none">
                            <span onClick={this.CLoseMenuTrigger} className="closeTrigger"><FiX /></span>
                        </div>
                    </div>
                </div>
                
            </header>
        )
    }
}
export default Header;