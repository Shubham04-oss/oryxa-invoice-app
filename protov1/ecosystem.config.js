module.exports = {
  apps: [
    {
      name: 'oryxa-api',
      script: 'npm',
      args: 'run start:api',
      cwd: '/var/www/oryxa',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/oryxa-api-error.log',
      out_file: '/var/log/pm2/oryxa-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    },
    {
      name: 'oryxa-worker',
      script: 'npm',
      args: 'run start:worker',
      cwd: '/var/www/oryxa',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/pm2/oryxa-worker-error.log',
      out_file: '/var/log/pm2/oryxa-worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};
