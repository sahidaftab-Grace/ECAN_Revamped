const { Client } = require('pg');
require('dotenv').config();

async function createDb() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE "ECAN"');
    console.log('Database "ECAN" created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database "ECAN" already exists');
    } else {
      console.error(err);
    }
  } finally {
    await client.end();
  }
}

createDb();