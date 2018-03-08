const darkskyKey = process.env.DARK_SKY; 
const https = require('https');
const express = require("express");
const app = express();

app.get('/getWeather/:lat/:long/:time', function(req, res) {
	callweather(req.params.lat, req.params.long, req.params.time, (weather) => {
		console.log("response : " + JSON.stringify(weather));
		res.json(weather);
	});
});
app.listen(process.env.PORT || 8082, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
});

function callweather(lat, long, time, fn) {
	var options = {
		hostname : 'api.darksky.net',
		path : '/forecast/' + darkskyKey + '/' + lat + ',' + long + ',' + time + 
			   	'?exclude=currently,flags,minutely,hourly,offset',
		method : 'GET'
	};
	var req = https.request(options, (res) => {
		let reply = '';
		res.on('data', (chunk) => {
			reply = JSON.parse(chunk);
			reply=reply['daily']['data'][0];
		});
		res.on('error', (e) => {
			console.error(e);
		});
		res.on('end', () => {
			fn(reply);
		});
	}).end();
}
