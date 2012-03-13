var io = require('socket.io')

var FacebookClient = require('facebook-client').FacebookClient;
var facebook = new FacebookClient();
var uuid = require('node-uuid');

var _debug = false;


function setup_sockets() {
  // create a socket.io backend for sending facebook graph data
  // to the browser as we receive it
  io = require('socket.io').listen(app);

  // wrap socket.io with basic identification and message queueing
  // code is in lib/socket_manager.js
  socket_manager = require('./lib/socket_manager').create(io);

  // use xhr-polling as the transport for socket.io
  io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
    io.set('log level', 0);
  });
};


exports.init = function initFbApi () {
  
     setup_sockets();
      
     if(_debug) console.log('FB-API: Started')
      
      railway.tools.fbapi = 
      {  
          friends: function (request,_args){
            if (request.session.auth) {
              var token = request.session.auth.facebook.accessToken;
                if(!_args) {
                  var socket_id = uuid();
                }
                facebook.getSessionByAccessToken(token)(function(session) {
                  
                   session.graphCall('/me/friends')(function(result) {
                     if(_args) {_args(result);return 0;}
                     else
                     {
                       result.data.forEach(function(friend) {
                         console.log('Emiting socket, uuid: '+socket_id);
                         socket_manager.send(socket_id, 'friend', friend);
                       });
                     }
                   });
                 });
                 if(!_args) return socket_id;
              }
             else {
               if(_debug) console.log('FB-API: Not logged in Facebook!'); return "undefined";
               }
            }
    };


};


/* Implementation Notes 

Two paths :

action: function (request,_args){
    
    // Commmon PreConds
    
   function sync(cb)
   {
    //Sync Process (with cb)
   };
 
   function async()
   {
    //Async Process
   }
  
   return _args == null ? async() : sync(_args); //Args check
}

--

Small variations :

action: function (request,_args){

      if(!_args) {.. modifiers}
       if(_args) {_args(result);return 0;}
       if(!_args) return socket_id;
}
*/
   
 