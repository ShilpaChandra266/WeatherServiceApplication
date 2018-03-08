const location_host = process.env.LURL;
const weather_host = process.env.RURL;
const daySec = 60 * 60 * 24;
const https = require('https'); 
const express = require("express");
const path = require('path');
const index = require('./routes/index');
const url = require('url');
const sortJsonArray = require('sort-json-array');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
  res.render('index');
})

app.get('/weatherData/', function(req, resp) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var loc = req.query.loc;
  console.log(loc);
  loc = loc.replace(/\s/g, '');
	var options = {
		hostname : location_host,
		path : '/geocode/' + loc , 
		method : 'GET'
	};
	var req = https.request(options, (res) => {
		let reply = '';
		res.on('data', (chunk) => {
			reply = JSON.parse(chunk);
		});
		res.on('error', (e) => {
			console.error(e);
		});
		res.on('end', () => {
			getWeather(reply['latitude'], reply['longitude'], (json) => {
				json=sortJsonArray(json,'time');
				resp.json(json);
			});
		});
	}).end();
});
app.listen(8080);
console.log("Server started.. ")

function getWeather(latitude, longitude, fn) {
	var weatherData = []
	for (var i = 0; i < 8; i++) {
		var options = {
			hostname : weather_host,
			//port : 8082 ,
			path : '/getWeather/' + latitude + "/" + longitude + "/" + getTime(i) ,
			method : 'GET'
		};
		var req = https.request(options, (res) => {
			let reply = '';
			res.on('data', (chunk) => {
				reply = JSON.parse(chunk);
			});
			res.on('error', (e) => {
				console.error(e);
			});
			res.on('end', () => {
				weatherData.push(reply);
				if(weatherData.length == 8) {
					console.log(weatherData);
					fn(weatherData);
				}
			});
		}).end();
	}
}

function getTime(i) {
	return Math.round(new Date()/1000) - (i * daySec);
}
