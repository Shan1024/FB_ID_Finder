/*
  © Malith Shan Mahanama - 2015/08/29
  (gambit1024@gmail.com)
*/

var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var chalk   = require('chalk');
var app     = express();

app.get('/', function(req, res){
  res.send('Welcome to FB ID scraper');
});

app.get('/api', function(req, res){
  res.send('Welcome to FB ID scraper');
});

app.get('/api/:id', function(req, res){

    console.log(chalk.yellow("ID lookup for " + req.params.id + " requested"));
    console.log(chalk.yellow("Searching . . ."));
    //Send a POST request with the fb app id
    request({
      url : "https://lookup-id.com",
      method : "POST",
      form : {//we can use 'qs' here for queries
          "fburl": "https://www.facebook.com/" + req.params.id,
          "check": "Lookup"
      }
    }, function(error, response, html){

        //Checking for errors
        if(!error){

            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);

            // Variables we're going to capture
            var $code = $('#code');

            //Extract the id
            var id = $code.text();

            //If id available
            if(id){
              console.log(chalk.yellow("ID Found: " + id));
              res.json({"app_id": req.params.id, "user_id": $code.text()});
            }else{
              console.log(chalk.red("ID Not Found"));
              res.json({"app_id": req.params.id, "user_id": "Not Found"});
            }
        }else{
          console.log(chalk.red('Error occured: ' + error));
        }
    })
});

// app.get('/token',function(req,res){
//   request({
//     url : "http://localhost:9090/api/authenticate",
//     method : "POST",
//     form : {
//         "username": "shan",
//         "password": "mahanama"
//     }
//   }, function(error, response, html){
//
//     console.log(html);
//     res.send(html);
//   })
//
// });

var port = process.env.PORT ||8080;
app.listen(port);
console.log(chalk.green('Server started at port '+port));
exports = module.exports = app;
