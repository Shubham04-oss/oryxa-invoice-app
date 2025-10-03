import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    // MySQL-compatible query (use backticks for column aliases)
    const timeResult = await prisma.$queryRaw`SELECT NOW() as \`server_time\``;
    const dbResult = await prisma.$queryRaw`SELECT DATABASE() as \`db_name\``;
    
    console.log('✅ Connection successful!');
    console.log('Database:', dbResult[0].db_name);
    console.log('Server time:', timeResult[0].server_time);
    
    // Test if we can query users
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n🔍 Troubleshooting P1001 - Cannot reach database server:');
      console.log('1. Check database credentials and hostname');
      console.log('2. Verify Remote MySQL is enabled in Hostinger hPanel');
      console.log('3. Check if your IP is whitelisted for remote access');
      console.log('4. Ensure database user has proper permissions');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
