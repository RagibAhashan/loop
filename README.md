# sneaker bot

## Install dependencies

`cd app`

`yarn install`

## Development

Start the react dev server first

`yarn start:react`

Start electron

`yarn start:electron`

## Developer Guide

### React

-   Functional components require to be typed :

```javascript
interface Props {
    field1: string:
}

const MyComponent: React.FunctionalComponents<Props> = (props) => {
}
```

### Backend

-   Follow this pattern :

    -   A class that contains a model and service methods

    -   A factory class that creates the model

    -   A manager class that link the View and services

    i.e for TaskGroup :

    ```
    TaskGroup.ts : Service that handle a TaskGroup
    TaskGroupFactory.ts : Creates a TaskGroup
    TaskGroupManager.ts : Contains method that calls TaskGroup.ts and emit events to the view
    ```

## Build for production

`yarn build` then `yarn package`

The build will be in the `release` folder
