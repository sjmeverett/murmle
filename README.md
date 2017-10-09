# murmle

Logging shouldn't be overly complex.  Logging libraries are huge,
with all sorts of stuff to e.g. email logs or rotate logs etc.  This
goes against the UNIX philosophy - just write your logs to STDOUT and
use another tool to do the other stuff, e.g. logrotate(8).

You have to look at STDOUT and STDERR anyway, otherwise you might miss
stacktraces from catastrophes, so really all your logging should go there.

Also, wading through logs is tiring, so maybe they should just be JSON
and you can use tooling to search them.

## Usage

```javascript
import Logger, { writePretty, writeJson } from 'murmle';

// write JSON if we're in production and
// pretty output (more human readable) if we're not
if (process.env.NODE_ENV === 'production') {
  Logger.default.on('log', writeJson);
} else {
  Logger.default.on('log', writePretty);
}

Logger.default.info('a thing happened');
```

With the pretty writer, this outputs:

    ✔ [2017-01-06 22:21:04] info a thing happened

And with the JSON writer:

    {"level":30,"message":"test message","time":"2017-01-06T22:33:46.276Z"}

There is also a `writeBunyan` function to write [Bunyan](https://www.npmjs.com/package/bunyan)-compatible
JSON output.

## The log object

Every log object has a `level` and a `time`.  Simple ones also have a `message`, and any other field can be included.

## Log levels

| Name | Numeric value | Description |
|------|---------------|-------------|
| trace | 10 | Very detailed logging, external libraries, etc. |
| debug | 20 | More detailed than info. |
| info | 30 | Detail on regular operation. |
| warn | 40 | A potential problem that should be looked at eventually. |
| error | 50 | An error affecting the current operation or request, which leaves the application functioning. |
| fatal | 60 | The whole application has borked. |


The `Logger` class has a method for each of these levels, which have the following signatures:

  * `(message: string, ...args: any[])` - logs an object with `message` field set as specified,
  with optional `util.format` arguments

  * `(obj)` - logs the specified object, adding the `time` and `level` fields automatically

There is also a `log` method, which is the same as above only it accepts a first argument of `LogLevel` to
specify the log level dynamically.
