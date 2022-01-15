import React from 'react';

export const SuccessCheckout = () => {
    return (
        <div>
            <h1> Success </h1>
            <h2> Thank you for your purchase. You should have received a key in your email</h2>
        </div>
    );
};

export const CancelCheckout = () => {
    return (
        <div>
            <h1> Cancel </h1>
            <h2> You payment was canceled </h2>
        </div>
    );
};
