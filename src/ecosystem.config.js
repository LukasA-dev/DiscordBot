module.exports = {
  apps: [
    {
      // App
      name: "Test BOT",
      script: "index.js",

      // Logs
      out_file: "../Logs/out.log",
      error_file: "../Logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      log_file_max_size: "10M",
      log_file_backups: 5,

      // Environment
      env_file: "./.env",
      env: {
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      },
    },
  ],
};
