module.exports = {
  apps: [
    {
      name: 'bluedelivery-backend',
      script: 'src/index.js',
      cwd: '/www/wwwroot/bluedelivery/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 33570
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true
    }
  ]
};
