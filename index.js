"use strict";

const fs    = require('fs');
const path  = require('path');
const spawn = require("child_process").spawn;


const defaultConfig = {
  port: 5432
};

const PGUSER = "postgres";
const PGBIN  = path.join(__dirname, 'server/bin');

const initDataDir = function(dataDir, chain){

  try {
    var dataDirStat = fs.statSync(dataDir);
  } catch(err) {

    // Data directory does not exist
    var initResult = spawn(
      path.join(PGBIN, 'initdb'),
      [ '-D', dataDir,  '-U',  PGUSER, '-A', 'trust', '-E', 'utf8' , '--locale=C']);

    initResult.on('exit', function(exit){
      return chain(exit === 0 ? null : "Bad exit code");
    });

    return;
  }

  if(dataDirStat && !dataDirStat.isDirectory()) 
    return chain('DATA_DIRECTORY_UNAVAILABLE');

  chain();
}

/*
 * Start the PostgreSQL server
 * @param {String} dataDir Directory will be initialized if does not exist
 * @param {Object} config  Settings for postgresql.conf
 * @return (err, {ChildProcess})  postgres server instance
 */
module.exports = function(dataDir /*[, config,] chain */) {
  var args  = Array.from(arguments),
      dataDir = args.shift(),
      chain = args.pop(),
      config = args.pop() || {};

  var fullConfig = Object.assign({}, defaultConfig, config);

  initDataDir(dataDir, function(err){

    if(err)
      return chain(err);

    // Generate postgresql.conf from provided configuration
    var conf = Object.keys(fullConfig).map(function(key) {
      return (fullConfig[key] === null) ? null : key + ' = ' + fullConfig[key];
    }).join('\n');




    var PGLOG = path.join(dataDir, "server.log");
    //fs.writeFileSync(path.join(dataDir, 'postgresql.conf'), conf);
//"%PGBIN%\pg_ctl" -D "%PGDATA%" stop


    var child = spawn(
      path.join(PGBIN, 'postgres'), [
      '-D', dataDir ,// '-l', PGLOG, 
      //'-w', 'start'
    ]);

    child.softkill = function() {
      spawn( path.join(PGBIN, 'pg_ctl'), [ '-D', dataDir, 'stop' ]);
    }
    
    chain(null, child);
  });
}
