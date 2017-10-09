import * as util from 'util';
import { EventEmitter } from 'events';
import * as chalk from 'chalk';
import * as os from 'os';
import * as process from 'process';

const symbols = require('log-symbols');
const timestamp = require('time-stamp');


export enum LogLevel {
  /**
   * Very detailed logging, external libraries, etc.
   */
  trace = 10,
  /**
   * More detailed than info.
   */
  debug = 20,
  /**
   * Detail on regular operation.
   */
  info = 30,
  /**
   * A potential problem that should be looked at eventually.
   */
  warn = 40,
  /**
   * An error affecting the current operation or request, which leaves the application functioning.
   */
  error = 50,
  /**
   * The whole application has borked. 
   */
  fatal = 60
};



/**
 * Logger class.
 */
export default class Logger extends EventEmitter {
  /**
   * Logs the given object, adding the `level` and `time` fields.
   * @param level the log level to use
   * @param obj the object to log
   */
  log(level: LogLevel, obj);
  /**
   * Logs the given message, `util.format`-style, adding the `level` and `time` fields.
   * @param level the log level to use
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  log(level: LogLevel, message: string, ...args: any[]);
  log(level: LogLevel, obj, ...args: any[]) {
    if (typeof obj === 'string') {
      obj = {message: util.format(obj, ...args)};

    } else if (obj instanceof Error) {
      obj = {message: obj.message, stack: obj.stack};
    }

    let log = {level, ...obj, time: new Date()};
    this.emit('log', log);
  }

  /**
   * Logs the given object, setting the level to `trace` and adding the `time` field.
   * @param obj the object to log
   */
  trace(obj);
  /**
   * Logs the given message util.format`-style, setting the level to `trace` and adding the `time` fields.
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  trace(message: string, ...args: any[]);
  trace(...args: any[]) {
    this.log.call(this, LogLevel.trace, ...args);
  }

  /**
   * Logs the given object, setting the level to `debug` and adding the `time` field.
   * @param obj the object to log
   */
  debug(obj);
  /**
   * Logs the given message util.format`-style, setting the level to `debug` and adding the `time` fields.
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  debug(message: string, ...args: any[]);
  debug(...args: any[]) {
    this.log.call(this, LogLevel.debug, ...args);
  }

  /**
   * Logs the given object, setting the level to `info` and adding the `time` field.
   * @param obj the object to log
   */
  info(obj);
  /**
   * Logs the given message util.format`-style, setting the level to `info` and adding the `time` fields.
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  info(message: string, ...args: any[]);
  info(...args: any[]) {
    this.log.call(this, LogLevel.info, ...args);
  }

  /**
   * Logs the given object, setting the level to `warn` and adding the `time` field.
   * @param obj the object to log
   */
  warn(obj);
  /**
   * Logs the given message util.format`-style, setting the level to `warn` and adding the `time` fields.
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  warn(message: string, ...args: any[]);
  warn(...args: any[]) {
    this.log.call(this, LogLevel.warn, ...args);
  }

  /**
   * Logs the given object, setting the level to `error` and adding the `time` field.
   * @param obj the object to log
   */
  error(obj);
  /**
   * Logs the given message util.format`-style, setting the level to `error` and adding the `time` fields.
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  error(message: string, ...args: any[]);
  error(...args: any[]) {
    this.log.call(this, LogLevel.error, ...args);
  }

  /**
   * Logs the given object, setting the level to `fatal` and adding the `time` field.
   * @param obj the object to log
   */
  fatal(obj);
  /**
   * Logs the given message util.format`-style, setting the level to `fatal` and adding the `time` fields.
   * @param message the message to use for the `message` field, possibly with format placeholders
   * @param args values to use for the format placeholders, if any
   */
  fatal(message: string, ...args: any[]);
  fatal(...args: any[]) {
    this.log.call(this, LogLevel.fatal, ...args);
  }

  /**
   * The default instance.
   */
  static readonly default = new Logger();
};


/**
 * Log handler to write JSON to console.
 */
export function writeJson(log) {
  console.log(JSON.stringify(log));
};

const hostname = os.hostname();

/**
 * Writes Bunyan-compatible JSON.
 */
export function writeBunyan(log) {
  const {message, ...rest} = log;

  writeJson({
    ...rest,
    msg: log.message || 'object',
    pid: process.pid,
    name: 'default'
  });
};


const levelInfo = {
  [LogLevel.trace]: {name: chalk.blue('trace'), symbol: symbols.info},
  [LogLevel.debug]: {name: chalk.gray('debug'), symbol: symbols.info},
  [LogLevel.info]: {name: chalk.green('info'), symbol: symbols.success},
  [LogLevel.warn]: {name: chalk.yellow('warn'), symbol: symbols.warning},
  [LogLevel.error]: {name: chalk.red('error'), symbol: symbols.error},
  [LogLevel.fatal]: {name: chalk.bold.red('fatal'), symbol: symbols.error}
};

/**
 * Log handler to write prettily to console.
 */
export function writePretty(log) {
  const logLevel = levelInfo[log.level];
  const ts = timestamp('YYYY-MM-DD HH:mm:ss', log.time);
  let str = `${logLevel.symbol} [${ts}] ${logLevel.name} `;

  if (log.message)
    str += log.message + ' ';

  const {level, time, message, ...rest} = log;

  if (Object.keys(rest).length) {
    for (let k in rest) {
      str += `\n\t${chalk.cyan(k + ':')} `;

      if (typeof rest[k] === 'object') {
        str += util.inspect(rest[k], {depth: null, colors: true});

      } else {
        str += rest[k];
      }
    }
  }

  console.log(str);
};
