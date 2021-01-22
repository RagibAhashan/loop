const express = require('express');
const app = express();
const port = 3200;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const random = () => {
    let random = Math.round(Math.random() * 1000);
    console.log(random);
    return random;
};

app.use((req, res, next) => {
    setTimeout(next, random());
});

app.get('/api/v4/session', (req, res) => {
    res.cookie('JSESSIONID', 'hereacookielol');
    res.json({ data: { csrfToken: 'csrf123' } }).status(200);
});

app.get('/api/products/pdp/:code', (req, res) => {
    res.json({ sellableUnits: [] }).status(200);
});

app.post('/api/users/carts/current/entries', (req, res) => {
    res.cookie('cart-guid', 'hereacookielol');

    res.sendStatus(200);
});

app.put('/api/users/carts/current/email/:stringemail', (req, res) => {
    res.sendStatus(200);
});

app.post('/api/users/carts/current/addresses/shipping', (req, res) => {
    res.sendStatus(200);
});

app.post('/api/users/carts/current/set-billing', (req, res) => {
    res.sendStatus(200);
});

app.post('/api/v2/users/orders', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`);
});
