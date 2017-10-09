import test from 'ava';
import Logger, * as Log from '../lib/Logger';

test('it works', (t) => {
  let logger = new Logger();
  t.plan(3);

  logger.once('log', (log) => {
    t.is(log.message, 'test message');
    t.true(log.time instanceof Date);
    t.is(log.level, Log.LogLevel.info);
  });

  logger.on('log', Log.writeJson);
  logger.on('log', Log.writePretty);

  logger.info('test %s', 'message');
  logger.fatal(new Error('test'));
});