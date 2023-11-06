// Create web server to handle comments
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '111111',
  database: 'o2'
});
db.connect();

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;
  var pathname = url.parse(_url, true).pathname;
  var template = require('./lib/template.js');
  console.log(url.parse(_url, true));
  if(pathname === '/'){
    if(queryData.id === undefined){
      db.query(`SELECT * FROM topic`, function(error, topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          console.log(topic);
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>
            ${description}
            <p>by ${topic[0].name}</p>
            `,
            ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>
            `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if(pathname === '/create
