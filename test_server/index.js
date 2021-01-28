const express = require('express');
const app = express();
const port = 3200;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const random = () => {
    let random = Math.round(Math.random() * 2500);
    return random;
};
const error = () => {
    return 1 === Math.round(Math.random() * 3);
};

app.use((req, res, next) => {
    setTimeout(() => {
        console.log('next from', req.url);
        next();
    }, random());
});
app.get('/api/v4/session', (req, res) => {
    res.cookie('JSESSIONID', 'hereacookielol');

    if (error()) res.sendStatus(500);
    else res.json({ data: { csrfToken: 'csrf123' } }).status(200);
});

app.get('/api/products/pdp/:code', (req, res) => {
    if (error()) res.sendStatus(500);
    else res.json({ sellableUnits: [] }).status(200);
});

app.post('/api/users/carts/current/entries', (req, res) => {
    res.cookie('cart-guid', 'hereacookielol');

    if (error()) res.sendStatus(500);
    else res.sendStatus(200);
});

app.put('/api/users/carts/current/email/:stringemail', (req, res) => {
    if (error()) res.sendStatus(500);
    else res.sendStatus(200);
});

app.post('/api/users/carts/current/addresses/shipping', (req, res) => {
    if (error()) res.sendStatus(500);
    else res.sendStatus(200);
});

app.post('/api/users/carts/current/set-billing', (req, res) => {
    if (error()) res.sendStatus(500);
    else res.sendStatus(200);
});

app.post('/api/v2/users/orders', (req, res) => {
    if (error()) res.sendStatus(500);
    else res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`);
});
