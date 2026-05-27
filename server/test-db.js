const pool = require('./db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful! Database time:', res.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();