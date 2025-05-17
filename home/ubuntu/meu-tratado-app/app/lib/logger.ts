type LogLevel = 'info' | 'error' | 'warn' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    switch (level) {
      case 'error':
        console.error(JSON.stringify(logMessage, null, 2));
        break;
      case 'warn':
        console.warn(JSON.stringify(logMessage, null, 2));
        break;
      case 'info':
        console.info(JSON.stringify(logMessage, null, 2));
        break;
      case 'debug':
        console.debug(JSON.stringify(logMessage, null, 2));
        break;
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();