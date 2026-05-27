const { Client } = require('pg');
require('dotenv').config();

async function listDbs() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres' // connect to default
  });

  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database');
    console.log('Databases:', res.rows.map(r => r.datname));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

listDbs();