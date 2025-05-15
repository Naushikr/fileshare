const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',  // default log level, can be changed dynamically
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.colorize(),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} ${level}: ${message} - ${stack}`
        : `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    // You can add file transports if you want to log to files:
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
