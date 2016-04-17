# MMM-Traffic
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can display commute time between two given addresses by car, walking, or transit. The module uses the Google Maps Directions API to get commute time, which factors in traffic information.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/SamLewis0602/MMM-Traffic.git`. A new folder will appear, navigate into it.
2. Execute `npm install` to install the node dependencies.

## Usage
The entry in config.js can look like the following. You will need an `api_key`, you can get one [here](https://developers.google.com/maps/documentation/directions/).

```
{
	module: 'MMM-Traffic',
	position: "top_left",
	header: 'Traffic',
	config: {
		//your personal api key from link above
		api_key: "your_apikey_here",
		//method of transportation, can be "driving", "walking", "bicycling", "transit"
		mode: "driving",
		//address of starting point
		origin: "origin_address_here",
		//address of destination
		destination: "destination_address_here",
		//update interval in seconds
		interval: 60
	}
},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Important Notes
- This is my first project using Node, so feel free to submit pull requests or post on the issues/wiki and I will do my best to improve the project.
