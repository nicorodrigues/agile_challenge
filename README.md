# Agile Engine Code Challenge

## Images metadata cache

The purpose of this app is to act as a cache proxy between the real API and the client.

This service works by mantaining an indexing list on memory inside the APP and a full data mirroring on a Redis DB. The service refreshes the in-app cache once in a defined period of time, configurable in the ENV.

```
Warning: If you're not going to use a password for redis, then don't uncomment the key in the .env file
```

As it is, the app will run on port `3000` and will use the endpoints provided.

## Endpoints

-   /

    -   It returns the full indexing list

-   /:searchTerm

    -   It makes a full-text search using the in-app indexing list and returns the Redis-saved full objects. If nothing is found, it will return an empty array.

-   /id/:id
    -   It returns only the object if found inside the Redis cache, otherwise it will throw a 404 error.

## Install

To install the application, follow this steps:

1. `git clone https://www.github.com/nicorodrigues/agile_challenge`
2. `cd agile_challenge`
3. `npm install`
4. Copy the `.env.example` file as `.env` and change config as needed.
5. `npm run dev` will put the application into dev mode which will allow you to run it as is. For `production` please read below.

## Deployment

To deploy into a production environment follow this steps:

1. `npm run build`
2. Deploy the `dist` folder to any server with node installed and run `npm run start` to start the server inside.
