import React, { Component } from "react";
import Footer from "../component/footer/FooterTwo";


class ContactTwo extends Component{
    constructor(props){
        super(props);
        this.state = {
            rnName: '',
            rnEmail: '',
            rnSubject: '',
            rnMessage: '',
        };
    }
    render(){
        return(
            <>
            {/* <Header headerPosition="header--transparent" color="color-white" logo="logo-light" /> */}
            <div className="rn-finding-us-area attacment-fixed rn-finding-us ptb--120 bg_color--2" data-black-overlay="5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="inner">
                                <div className="content-wrapper">
                                    <div className="content">
                                        <h4 className="theme-gradient">Register</h4>
                                        <p>When looking at its layout. The point of using Lorem Ipsum is that.</p>
                                        <div className="form-wrapper">
                                            <form>
                                                <label htmlFor="item01">
                                                    <input
                                                        style={{backgroundColor: 'white', width:'500px'}}
                                                        type="text"
                                                        name="name"
                                                        id="item01"
                                                        value={this.state.rnName}
                                                        onChange={(e)=>{this.setState({rnName: e.target.value});}}
                                                        placeholder="e.x. EDEF-123S-21ES-CD21"
                                                    />
                                                </label>
                                                <div style={{marginTop:'30px'}}> 
                                                    <button className="btn-default" type="submit" value="submit" name="submit" id="mc-embedded-subscribe">Submit Now</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer /> 
            </>
        )
    }
}
export default ContactTwo;