RailwayJS Facebook API
======================
Sync/Async FB OpenGraph API Interaction for RailwayJS


Installation
------------
railway install git://github.com/rpavez/RailwayJS-Facebook-API.git
    
Requirements
------------

* railwayjs
* everyauth/mongoose-auth (implemented on environment)
    
Configuration
-------------
Include in npmfile.js :
`require('railway-facebook-api');`

Usage
-----

Sync Way :

				action('mycontroller', function () {
				  railway.tools.fbapi.friends(request,function(data){
				    render({friends:data});
				  });
				});


Async Way! :

				action('mycontroller', function () {
				   var socket_key = railway.tools.fbapi.friends(request);
				   render({socket_key: socket_key});
				});

  
  
 Include in you template (Jade):

				script
				  $(function() {
				  if ("#{socket_key}" != "undefined")
				    {
				      var socket = io.connect();
				      socket.on('connect', function() {
				        // identify this socket with our auth token
				        socket.emit('auth', '#{socket_key}');
				        // called when a friend is received
				        socket.on('friend', function(friend) {
				          console.log(friend);
				        });
				      });
				    }
				  });
				script(src="/socket.io/socket.io.js")