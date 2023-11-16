import { BaseLogger, LogLevel } from '@aries-framework/core';
import logger from '../../globalUtils/logger.js';

export class AgentLogger extends BaseLogger {
  public test(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.test)) return;
    logger.verbose(message, data);
  }

  public trace(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.trace)) return;
    logger.info(message, data);
  }

  public debug(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.debug)) return;
    logger.info(message, data);
  }

  public info(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.info)) return;
    logger.info(message, data);
  }

  public warn(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.warn)) return;
    logger.warn(message, data);
  }

  public error(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.error)) return;
    logger.error(message, data);
  }

  public fatal(message: string, data?: Record<string, any> | undefined): void {
    if (!this.isEnabled(LogLevel.fatal)) return;
    logger.error(message, data);
  }
}

export default AgentLogger;
