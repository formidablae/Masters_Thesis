import express from "express";
import dotenv  from "dotenv";
import cors from 'cors';
import { resolvers } from './graphql/resolvers.js';
import { ApolloServer } from 'apollo-server-express';
import { db } from './config/db.js';
import expressPlaygroundMiddleware from 'graphql-playground-middleware-express';
import { typeDefs } from './graphql/schema.js';

dotenv.config();
const app = express();
app.use(cors());

//const typeDefs = readFileSync('./graphql/types.graphql', 'UTF-8')
const server = new ApolloServer({ introspection: false, playground: true, typeDefs, resolvers, db });
await server.start();
server.applyMiddleware({ app, path: '/graphql' });
app.get('/', (req, res) => res.end('Welcome to the API'));
app.get('/playground', expressPlaygroundMiddleware.default({ endpoint: '/graphql' }));
app.listen(process.env.PORT, () =>
	console.log(`API up and running, listening on port ${process.env.PORT}!`)
);