/**
 * Test Hostinger MySQL Database Connection
 * 
 * Before running this:
 * 1. Install MySQL client: npm install mysql2
 * 2. Get your credentials from Hostinger hPanel > Databases
 * 3. Update the config below with your actual credentials
 */

import mysql from 'mysql2/promise';

// ✅ HOSTINGER DATABASE CREDENTIALS
const config = {
  host: 'srv1995.hstgr.io',             // Hostinger MySQL server
  port: 3306,
  user: 'u705159588_oryxadb',           // Your database username
  password: 'Oryxa@2025',               // Your database password
  database: 'u705159588_oyrxamain',     // Your database name
  ssl: {
    rejectUnauthorized: false           // Hostinger typically uses self-signed certs
  }
};

async function testConnection() {
  let connection;
  
  try {
    console.log('🔌 Attempting to connect to Hostinger MySQL...\n');
    console.log('Host:', config.host);
    console.log('User:', config.user);
    console.log('Database:', config.database);
    console.log('Port:', config.port);
    console.log('---');
    
    // Create connection
    connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!\n');
    
    // Test query
    const [rows] = await connection.execute('SELECT VERSION() as version, NOW() as server_time');
    console.log('📊 Database Info:');
    console.log('MySQL Version:', rows[0].version);
    console.log('Server Time:', rows[0].server_time);
    console.log('---\n');
    
    // List tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Existing Tables:', tables.length);
    if (tables.length > 0) {
      tables.forEach(table => {
        console.log('  -', Object.values(table)[0]);
      });
    } else {
      console.log('  (No tables yet - fresh database)');
    }
    
    console.log('\n✅ Hostinger database is ready to use!');
    console.log('\nNext steps:');
    console.log('1. Update your .env file with the DATABASE_URL');
    console.log('2. Switch Prisma schema from postgresql to mysql');
    console.log('3. Run: npx prisma db push');
    console.log('4. Run: node scripts/seed.js');
    
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Wrong credentials - check hPanel > Databases');
    console.error('2. IP not whitelisted - add your IP in Hostinger Remote MySQL');
    console.error('3. Database user permissions - ensure user has full access');
    console.error('4. Wrong hostname - check if it\'s mysql123.hostinger.com or similar');
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
