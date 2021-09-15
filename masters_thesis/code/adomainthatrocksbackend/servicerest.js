import { Database, aql } from "arangojs";
import dbConfig from '../config/db.js';

const db = new Database({
	url: dbConfig.url,
	databaseName: dbConfig.database,
	auth: {username: dbConfig.username, password: dbConfig.password}
});

try { /* query db */ } catch (e) { /* handle exception */ };

export default service;