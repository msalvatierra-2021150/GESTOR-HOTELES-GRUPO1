# RestServer IN6BM Hotel Manager G1

This is a RestServer with connection to MongoDB.

## Previous requirements
Make sure you have Node.js installed on your system. You can download it at [Node.js Official Website](https://nodejs.org/).

## Setting environment variables

1. Rename the `example.env` file to `.env` in the project root. This is necessary to have the environment variables set in the project.

2. Open the `.env` file and make sure to set the following environment variables:

    - `PORT`: The port you want the server to listen on.
    - `MONGODB_CNN` : The connection string to your MongoDB database.
    - `SECRET_KEY_FOR_TOKEN` : The secret key used to sign and verify authentication tokens.

## Installing dependencies

To install the required Node.js modules, run the following command in the project root:

```
npm install
```

## Project execution

To start the server, use the following command:
```
npm run dev
```

The server will be available on the port specified in your `.env` file.

## Additional notes

- Make sure you have a MongoDB database configured and that the connection string is correct in your `.env` file.

- This README provides a basic guide to getting started with the project. As more functionality is added to the project, consider expanding this README to provide additional documentation.

Enjoy working on the RestServer IN6BM G1 Hotel Manager project!