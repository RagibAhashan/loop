import React, { Component } from "react";
import {Link} from 'react-scroll'


class AboutTwo extends Component{
    render(){
        return(
            <React.Fragment>
                <div className="about-wrapper">
                    <div className="container">
                        <div className="row row--45 align-items-center">
                            <div className="col-lg-5 col-md-12">
                                <div className="about-inner inner">
                                    <div className="section-title">
                                        {/* <span className="subtitle">Join the botting Dynasty</span> */}
                                        <h2 className="title" >Secure Limited Releases Product with   <span style={{color:'#ff66a1'}}> One Click* </span> </h2>
                                        <p className="description" style={{textAlign: 'justify'}}>Our automated software speeds up your checkout process, allowing you to enjoy limited release products without paying resell prices.</p>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                                            <div className="about-us-list">
                                                <h5 className="title">Out of Stock</h5>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                                            <div className="about-us-list">
                                             {/* <Link to="Contact" spy={true} smooth={true} href="#Contact"><h5 className="title">Contact Sales</h5></Link> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="purchase-btn mt--50">
                                        <Link to="Show" spy={true} smooth={true} href="#Show"><a className="btn-transparent" href="/about">TAKE A PEEK</a></Link>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-14">
                                <div className="thumbnail">
                                    <img style={{boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 64px'}} className="w-150" src="/assets/images/ok.png" alt="About Images"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default AboutTwo;