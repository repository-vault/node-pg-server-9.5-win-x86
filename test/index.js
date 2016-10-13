"use strict";

const path  = require('path');

const expect = require('expect.js');
const pg     = require('pg-co');
const server = require('../');
const deleteFolderRecursive = require('nyks/fs/deleteFolderRecursive');
const isDirectorySync = require('nyks/fs/isDirectorySync');

    

describe("pg server test suite", function(){

  var dataDir = path.join(__dirname, "data");
  this.timeout(999999999);

  it("should start server", function* (done) {
    //if(isDirectorySync(dataDir))
      //deleteFolderRecursive(dataDir);
    
    server(dataDir, function(err, server){

      server.stderr.pipe(process.stderr);
      server.stdout.pipe(process.stdout);
      expect(err).to.be(null);

      console.log("Got server PID", server.pid);
      expect(server.pid).to.be.ok();

      setTimeout(server.softkill , 5000);
  
      server.on("exit", function(code){
          expect(code).to.be(0);
          done();
      });

    });
  });

});