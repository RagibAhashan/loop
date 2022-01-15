1. Start mongo, if starting from a docker container use

`docker run --name dynasty-mongo -d -p 27017:27017 mongo:latest`

later you can just use

`docker start dynasty-mongo`

## Development

### Stripe

-   Checkout: Stripe hosted payment form and logic

-   Customer portal : Stripe hosted portal to let user manager his subscriptions (cancel, change payment method, history, etc)

-   Customize branding : https://dashboard.stripe.com/settings/branding

-   To test webhooks follow : https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local
