import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import React from 'react';
import { Link } from 'react-scroll';

const AboutTwo = () => {
    const handleSubmitCheckoutSession = async (e) => {
        e.preventDefault();

        const lookup_key = e.target[0].value;
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

        axios.post(process.env.REACT_APP_SERVER_ENDPOINT + '/create-checkout-session', null, { params: { lookup_key } }).then((session) => {
            console.log('got session', session['data'].id);
            return stripe.redirectToCheckout({ sessionId: session['data'].id });
        });
    };
    return (
        <React.Fragment>
            <div className="about-wrapper">
                <div className="container">
                    <div className="row row--45 align-items-center">
                        <div className="col-lg-5 col-md-12">
                            <div className="about-inner inner">
                                <div className="section-title">
                                    {/* <span className="subtitle">Join the botting Dynasty</span> */}
                                    <h2 className="title">
                                        Secure Limited Releases Product with <span style={{ color: '#ff66a1' }}> One Click* </span>{' '}
                                    </h2>
                                    <p className="description" style={{ textAlign: 'justify' }}>
                                        Our automated software speeds up your checkout process, allowing you to enjoy limited release products without
                                        paying resell prices.
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                                        <div className="about-us-list">
                                            <div className="button-group mt--50">
                                                <form onSubmit={handleSubmitCheckoutSession}>
                                                    {/* Add a hidden field with the lookup_key of your Price */}
                                                    <input type="hidden" name="lookup_key" value="dynasty_aio_monthly" />
                                                    <button className="btn-default btn-border size-sm" id="checkout-and-portal-button" type="submit">
                                                        Buy Now
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                                        <div className="about-us-list">
                                            {/* <Link to="Contact" spy={true} smooth={true} href="#Contact"><h5 className="title">Contact Sales</h5></Link> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="purchase-btn mt--50">
                                    <Link className="btn-transparent" to="Show" spy={true} smooth={true} href="#Show">
                                        TAKE A PEEK
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-14">
                            <div className="thumbnail">
                                <img
                                    style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 64px' }}
                                    className="w-150"
                                    src="/assets/images/ok.png"
                                    alt="About Images"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default AboutTwo;
