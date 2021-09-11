import React, { Component } from "react";
class About extends Component{
    render(){
        let title = 'See for yourself.',
        description = 'Our easy to use interface takes care of everything, just sit back and relax';
        return(
            <React.Fragment>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center">
                                <span className="subtitle">{"Don't believe us?"}</span>
                                <h2 className="title">{title}</h2>
                                <p className="description" dangerouslySetInnerHTML={{ __html: description }}></p>
                            </div>
                        </div>
                    </div>
                <div className="about-wrapper">
                    <div className="container">
                        <div className="row row--85 align-items-center">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 mt--50">
                                <div className="thumbnail position-relative">
                                    <img style={{ boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9)'}} className="w-100" src="/assets/images/ok.png" alt="About Images"/>

                                    {/* <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='ZOoVOfieAF8' onClose={() => this.setState({isOpen: false})} /> */}
                                    {/* <button className="video-popup position-top-center theme-color" onClick={this.openModal}><span className="play-icon"></span></button> */}
                                </div>
                            </div>
                        </div>
                            {/* <div className="col-lg-7 col-md-12">
                                <div className="about-inner inner">
                                    <div className="section-title">
                                        <div className="icon">
                                            <FiSend />
                                        </div>
                                        <h2 className="title">{title}</h2>
                                        <p className="description">{description}</p>
                                        <p className="description">{description2}</p>
                                        <div className="purchase-btn">
                                            <Link className="btn-transparent" to="/">PURCHASE DYNASTY</Link>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default About;