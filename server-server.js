var fs = require('fs');
var express = require('express');
var server = express();
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require('util');

function puts(error, stdout, stderr) {
    util.puts(stdout);
    util.puts(stderr);
}

// from: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET'); //'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', ['Content-Type','X-Requested-With']);

    next();
}

server.use(allowCrossDomain);
server.use('/public', express.static(__dirname + '/public'));

server.get('/', function (req, res) {
  var html = fs.readFileSync(__dirname + '/public/index.html', 'utf8');
  res.send(html);
});

server.get('/news', function(req, res) {
    var text = fs.readFileSync(__dirname + '/news/latest.txt', 'utf8');
    text = text.replace(/\n/g, ' ').replace(/\s+/, '');
    res.send('{"latest": "' + text + '"}');
});

server.get('/system/info', function(req, res) {
    var isPine = process.env.PINESYSTEM || '0'; 

    fs.readdir('public/games', function(err, folders) {
        var games = [];

        [].forEach.call(folders, function(folder) {
            var filename = 'public/games/' + folder + '/game.json';
            games.push(JSON.parse(fs.readFileSync(filename, 'utf8')));
        });

        var info = {
            ispine: isPine,
            games: games
        }

        res.send(JSON.stringify(info));
    });

});

server.get('/game/:id', function(req, res) {
    var id = req.params.id.replace(/\s/g, '');

    var manifest = fs.readFileSync(__dirname + '/public/games/' + id + '/game.json', 'utf8');
    manifest = manifest.replace(/\n/g, ' ').replace(/\s+/, '');
    res.send(manifest);
});

server.get('/update', function(req, res) {
    var msg = '/update: stub - trying update.sh';
    console.log(msg);

    var proc = spawn('./update.sh', []);

    proc.on('stdout', function(data) {
        console.log('/sound: stdout: ' + data);
    });

    proc.on('stderr', function(data) {
        console.log('/sound: stderr: ' + data);
    });

    proc.on('exit', function(statusCode) {
        console.log('/update: result: ' + statusCode);
        var msg = '';

        if (statusCode == 0) {
            msg = 'ok - server restart required';
        } else if (statusCode == 1) {
            msg = 'up-to-date - no update required';
        } else if (statusCode == 2) {
            msg = 'merge conflict - manual intervention required';
        } else {
            msg = 'unknown error';
        }

        console.log(msg);
        res.send(msg);
    });
});

server.listen(80, function() {
    console.log('Pine store server is now listening on port 80.');
    console.log('Press ctrl+c to kill the server.');
});
