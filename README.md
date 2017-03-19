# PostgreSQL Server 9.5 for Windows x86 32-bit

Install and run [PostgreSQL server](http://www.postgresql.org) under the current user inside of the application directory.


[![Version](https://img.shields.io/npm/v/pg-server-9.5-win-x86.svg)](https://www.npmjs.com/package/pg-server-9.5-win-x86)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
![Available platform](https://img.shields.io/badge/platform-win32-blue.svg)


```
npm install pg-server-9.5-win-x86
```

Provides function for spawning PostgreSQL server instance specifying the data directory and configuration options. Returns [`ChildProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess).

```javascript

const startServer = require('pg-server-9.5-win-x86');

/*
 * Start the PostgreSQL server
 * @param {String} dataDir Directory will be initialized if does not exist
 * @param {Object} config  Settings for postgresql.conf
 */

startServer('dbdata', { port: 12345 }, function(err, postgres){


  postgres.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  postgres.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  postgres.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });

  // Later on, stop server...
  postgres.kill();

  //you can also kill "gracefully" postgres instance (recommanded)
  postgres.softkill(); //use pg_ctl to send soft shutdown signal

});

```

## Default Settings

* Default user name will be the the same as the user name for on the system. 
* Default password is `numtel` as specified in the `defaultpw` file.
* Default database is `postgres`.
* Default port is `5432` (may be changed with `port` configuration setting).

## License
* PostgreSQL in under https://www.postgresql.org/about/licence/