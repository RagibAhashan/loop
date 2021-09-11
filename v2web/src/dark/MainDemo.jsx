import React, { Component } from "react";
import ScrollToTop from 'react-scroll-up';
import { FiChevronUp } from "react-icons/fi";

import Header from "../component/header/Header";
import Footer from "../component/footer/Footer";

// import SliderOne from "../component/slider/SliderOne";
import ServiceTwo from "../elements/service/ServiceTwo";
import FAQ from "./FAQ";
import CounterOne from "../elements/counters/CounterOne";
import Testimonial from "../elements/Testimonial";
import About from "../component/HomeLayout/homeOne/About";
import AboutTwo from "../component/HomeLayout/homeOne/AboutTwo";
import BrandTwo from "../elements/BrandTwo";
import Helmet from "../component/common/Helmet";

class MainDemo extends Component{
    render(){
        return(
            <div className="active-dark"> 
                <Helmet pageTitle="DynastyAIO" />
                <Header headertransparent="header--transparent" colorblack="color--black" logoname="logo.png" />

                <div id="Home" className="about-area ptb--160 bg_color--5">
                    <AboutTwo />
                </div>

                {/* Start Slider Area  ---- BIG LETTERS HOME */} 
                {/* <div id="Home" className="slider-wrapper">
                    <SliderOne />
                </div> */}
                {/* End Slider Area   */}

                {/* Start Service Area  */}
                <div id="Services" className="service-area ptb--100 bg_color--1">
                   <div className="container">
                        <ServiceTwo />
                   </div>
                </div>
                {/* End Service Area  */}



                {/* Start About Area */}
                <div id="Show" className="about-area ptb--100 bg_color--5">
                    <About />
                </div>
                {/* End About Area */}

                {/* Start Brand Area */}
                <div id="Sites" className="rn-brand-area bg_color--1 ptb--120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="section-title text-center mb--30">
                                    <span className="subtitle">Top Supported Websites</span>
                                    <h2 className="title">We support what you need.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <BrandTwo />
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Brand Area */}

                {/* Start Testimonial Area */}
                <div id="Services" className="rn-testimonial-area bg_color--5 ptb--120">
                    <div className="container">
                        <Testimonial />
                    </div>
                </div>
                {/* End Testimonial Area */}  

                {/* Start CounterUp Area */}
                <div className="rn-counterup-area ptb--120 bg_color--1">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center">
                                    <span className="subtitle">Organic growth</span>
                                    <h2 className="title">Our Growth</h2>
                                    <p className="description">We have grown in strength over the past year.</p>
                                </div>
                            </div>
                        </div>
                        <CounterOne />
                    </div>
                </div>
                {/* End CounterUp Area */}



                {/* Start Back To Top */}
                <div className="backto-top">
                    <ScrollToTop showUnder={160}>
                        <FiChevronUp />
                    </ScrollToTop>
                </div>
                {/* End Back To Top */}


                <div id="FAQ" className="about-area ptb--100 bg_color--5">
                    <div className="section-title text-center">
                        <h2 className="title">Frequently Asked Questions</h2>
                    </div>
                    <FAQ> </FAQ>
                </div>

                <div id="Contact"><Footer /></div>
            </div>
        )
    }
}
export default MainDemo;