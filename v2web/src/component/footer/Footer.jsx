import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {FaTwitter ,FaInstagram ,FaFacebookF , FaLinkedinIn} from "react-icons/fa";
const logoUrl = <img src="/assets/images/dynasty/logo-horizontal-dark.png" alt="Dynasty" />;

const SocialShare = [
    {Social: <FaFacebookF /> , link: 'https://www.facebook.com/'},
    {Social: <FaLinkedinIn /> , link: 'https://www.linkedin.com/'},
    {Social: <FaInstagram /> , link: 'https://www.instagram.com/'},
    {Social: <FaTwitter /> , link: 'https://twitter.com/'},
]

class Footer extends Component{
    render(){
        return(
            <React.Fragment>
                <footer className="footer-area footer-style-01 bg_color--5">
                    {/* Start Call to Action Area  */} 
                    <div className="im-call-to-action-area ptb--70 im-separator">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-8 col-xl-6 col-md-12 col-sm-12 col-12">
                                    <div className="inner">
                                        <h2 className="text-white mb--0">Enough Talk, Let's Cop</h2>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-xl-4 offset-xl-2 col-md-12 col-sm-12 col-12">
                                    <div className="call-to-cation-tbn text-left text-lg-right mt_md--20 mt_sm--20">
                                        <a className="btn-default btn-large btn-border btn-opacity" href="#button">Buy Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Call to Action Area  */}

                    {/* Start Footer Area  */}
                    <div className="footer-wrapper ptb--70">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                                    <div className="ft-text">
                                        <div className="logo">
                                            <Link to="/">
                                                {logoUrl}
                                            </Link>
                                        </div>
                                        <p>Copyright © 2021 | DynastyAIO | All Rights Reserved.</p>
                                    </div>
                                </div>
                                
                                {/* Start Single Widget  */}
                                <div className="col-lg-2 col-xl-2 offset-xl-1 col-md-6 col-sm-6 col-12 mt_mobile--40">
                                    <div className="footer-link">
                                        <h4 style={{visibility: 'hidden'}}>Quick Link</h4>
                                    </div>
                                </div>
                                {/* End Single Widget  */}

                                {/* Start Single Widget  */}
                                <div className="col-lg-2 col-md-6 col-sm-6 col-12 mt_md--40 mt_sm--40">
                                    <div className="footer-link">
                                        <h4 style={{visibility: 'hidden'}}>Company</h4>
                                    </div>
                                </div>
                                {/* End Single Widget  */}

                                {/* Start Single Widget  */}
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--40 mt_sm--40">
                                    <div className="footer-link">
                                        <h4>Stay in touch</h4>
                                        <ul className="ft-link">
                                            <li>Email: <a href="mailto:admin@dynasty.com">admin@dynasty.com</a></li>
                                            <li>Email: <a href="mailto:hr@dynasty.com">hr@dynasty.com</a></li>
                                            <li>Phone: <a href="mailto:hr@example.com">514911811</a></li>
                                        </ul>

                                        <div className="social-share-inner mt--20">
                                            <ul className="social-share social-style--2 d-flex justify-content-start liststyle">
                                                {SocialShare.map((val , i) => (
                                                    <li key={i}><a href={`${val.link}`}>{val.Social}</a></li>
                                                ))}
                                            </ul>
                                        </div> 
                                    </div>
                                </div>
                                {/* End Single Widget  */}
                            </div>
                        </div>
                    </div>
                    {/* End Footer Area  */}
                </footer>
            </React.Fragment>
        )
    }
}
export default Footer;