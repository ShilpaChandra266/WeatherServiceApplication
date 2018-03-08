const geocodeKey = process.env.GEO_KEY; 
const NodeGeocoder = require('node-geocoder');
const express = require("express");
const app = express();
const options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: geocodeKey
};
const geocoder = NodeGeocoder(options);

app.get('/geocode/:loc', function(req, resp) {
	geocoder.geocode(req.params.loc, function(err, res) {
		var response = {
			latitude : res[0].latitude,
			longitude : res[0].longitude 
		};
		console.log("response : " + JSON.stringify(response));
		resp.json(response);
	});
});
const server = app.listen(process.env.PORT || 8082, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
});

