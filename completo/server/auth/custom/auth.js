var querystring = require('querystring');
var https = require('https');

var custom = {
  secret : 'rr-MMCBR5QazlWHIv4fnk888',
  client : '217249250024-839n00cpo4aucqlqv3nscgif1pcipalg.apps.googleusercontent.com',
  redir : 'http://localhost:8080/auth/custom/callback',
  auth : function(req,res){
    var params = {
      client_id : custom.client,
      redirect_uri : custom.redir,
      response_type : 'code',
      scope : "email profile"
    };
    var uri = 'https://accounts.google.com/o/oauth2/auth?';
    for(var param in params){
      uri+=('&'+param+'='+params[param]);
    }
    console.log(uri);
    res.redirect(uri);
  },
  callback : function(req,res){
    var code = req.query.code;
    var post_data = querystring.stringify({
      code : code,
      client_id : custom.client,
      client_secret : custom.secret,
      redirect_uri : custom.redir,
      grant_type : 'authorization_code'
    });
    //https://accounts.google.com/o/oauth2/token

    var post_options = {
      host: 'accounts.google.com',
      path: '/o/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    };
    var post_req = https.request(post_options, function(response) {
      //response.setEncoding('utf8');
      response.on('data', function (data) {
        var data=JSON.parse(data);
        token=data.id_token;
        console.log(token);
        //custom.me(token,function(data){
        //  console.log(data);
        //});
      });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

  },
  me : function(token,cb){
    //https://www.googleapis.com/plus/v1/people/me
    var options = {
      host: 'www.googleapis.com',
      path: '/plus/v1/people/me?access_token='+token
    };
    https.get(options,function(res){
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        console.log('BODY: ' + body);
        // ...and/or process the entire body here.
      })
    }).on('error',function(e){

    });
  }
};

module.exports = custom;
