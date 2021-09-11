import React, { Component } from "react";
import { FiActivity, FiCopy, FiShoppingCart } from "react-icons/fi";


const ServiceList = [
    {
        icon: <FiActivity />,
        title: 'The Real All-In-One',
        description: 'We support all kinds of websites ranging from sneakers to retail. Shopify to Walmart. Foot Locker to BestBuy.'
    },
    {
        icon: <FiShoppingCart />,
        title: 'Unlimited Checkouts',
        description: "Don't worry on missing out on a drop, we got you covered. Dynasty allows users to create an unlimited amount of tasks."
    },
    {
        icon: <FiCopy />,
        title: 'Cross Platform',
        description: 'Our state of the art desktop Bot works on all platforms: Linux, Mac, and Windows. Mobile App coming soon.'
    },
]
class ServiceOne extends Component{
    render(){
        return(
            <React.Fragment>
                <div className="row row--25">
                    {ServiceList.map( (val , i) => (
                        <div className="col-lg-4 col-md-6 col-sm-6 col-12" key={i}>
                            <div className="service service__style--1">
                                <div className="icon">
                                    {val.icon}
                                </div>
                                <div className="content">
                                    <h4 className="title">{val.title}</h4>
                                    <p>{val.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    }
}
export default ServiceOne;