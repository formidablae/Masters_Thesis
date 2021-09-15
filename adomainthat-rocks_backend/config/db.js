import dotenv from 'dotenv';
import { Database } from "arangojs";

dotenv.config();

let dbConfig = {
	'url': process.env.DB_HOST,
	'database': process.env.DB_NAME,

	// Database user credentials to use
	'username': process.env.DB_USER,
	'password': process.env.DB_PASS
};

const db = new Database({
    url: dbConfig.url,
    databaseName: dbConfig.database,
    auth: {
        username: dbConfig.username,
        password: dbConfig.password
    },
});

export { db };