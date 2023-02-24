# GraphQL Notes

1. Setup GraphQL Backend

   1. Create your package.json file
      ```bash
      npm init -y
      ```
   2. Install global dependencies

      ```bash
      # Note: the colors dependency is optional
      npm i express express-graphql graphql mongoose cors colors
      ```

   3. Install dev dependencies

      ```bash
      # Note: the colors dependency is optional
      npm i -D nodemon dotenv
      ```

Queries: Get Data
Mutations: Change Data

2.  Setup React Frontend
    1.  Create React app in new `client` directory
        ```bash
        npx create-react-app@5.0.1 client
        ```
    2.  Install Frontend Dependencies
        ```bash
        cd client/
        npm i @apollo/client graphql react-router-dom react-icons
        ```
    3.  Clean up react app
        ```bash
        rm src/logo.svg src/index.css src/App.test.js
        ```
    4.
3.
