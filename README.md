# MMM-Traffic
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can display commute time between two given addresses by car, walking, or transit. The module uses the Google Maps Directions API to get commute time, which factors in traffic information.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/SamLewis0602/MMM-Traffic.git`. A new folder will appear, navigate into it.
2. Execute `npm install` to install the node dependencies.

## Usage
The entry in `config.js` can include the following options:

#### Required config options
You can get an api key [here](https://developers.google.com/maps/documentation/directions/).
```
api_key: 'your_apikey_here'
```
Address of starting/ending locations just as you would write them on an envelope, i.e. "123 North Main Street Chicago, Illinois 55555"
```
origin: 'origin_address_here',
destination: 'destination_address_here'
```
#### Optional
Mode of transportation, default is driving, can also be walking, bicycling, or transit
```
mode: 'driving'
```
Update interval in seconds, default is 60
```
interval: 60
```
Here is an example of an entry in `config.js`
```
{
	module: 'MMM-Traffic',
	position: 'top_left',
	header: 'Traffic',
	config: {
		api_key: 'your_apikey_here',
		mode: 'driving',
		origin: '4 Pennsylvania Plaza, New York, NY 10001',
		destination: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
		interval: 300
	}
},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Important Notes
- This is my first project using Node, so feel free to submit pull requests or post on the issues/wiki and I will do my best to improve the project.

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/v2-beta) project that made this module possible.
- [Paul-Vincent Roll](https://github.com/paviro) for creating the [Wunderlist](https://github.com/paviro/MMM-Wunderlist) module that I used as guidance in creating this module.
