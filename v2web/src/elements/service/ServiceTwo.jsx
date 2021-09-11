import React, { Component } from "react";
import { FiCreditCard , FiLayers , FiUsers , FiZap , FiMail, FiGlobe } from "react-icons/fi";

const ServiceList = [
    {
        icon: <FiCreditCard />,
        title: 'Captcha Harvester',
        description: 'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
        icon: <FiZap />,
        title: 'Lightning Fast',
        description: 'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
        icon: <FiMail />,
        title: 'Unmatched Support',
        description: 'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
        icon: <FiLayers />,
        title: 'Effortless UI',
        description: 'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
        icon: <FiUsers />,
        title: 'Expert Team',
        description: 'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
        icon: <FiGlobe />,
        title: 'International',
        description: 'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
]

class ServiceTwo extends Component{
    render(){
        let title = 'Services that we provide to you.',
        description = 'Here are a few key components that make Dynasty',
        subtitle= 'What we can do for you';
        return(
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center">
                                <span className="subtitle">{subtitle}</span>
                                <h2 className="title">{title}</h2>
                                <p className="description" dangerouslySetInnerHTML={{ __html: description }}></p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-12 mt--30">
                            <div className="row service-main-wrapper">
                                {ServiceList.map( (val , i) => (
                                    <div className="col-lg-4 col-md-6 col-sm-6 col-12" key={i}>
                                        <a href="/service-details">
                                            <div className="service service__style--2 text-left">
                                                <div className="icon">
                                                    {val.icon}
                                                </div>
                                                <div className="content">
                                                    <h3 className="title">{val.title}</h3>
                                                    <p style={{textAlign: 'justify'}}>{val.description}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default ServiceTwo;
