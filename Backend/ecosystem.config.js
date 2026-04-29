module.exports = {
  apps: [
    {
      name: 'dukandost-api',
      script: 'node',
      args: '--loader tsx server.ts',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
