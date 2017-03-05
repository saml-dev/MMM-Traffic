# MMM-Traffic
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). It can display commute time between two given addresses by car, walking, bicycling, or transit. The module uses the Google Maps Directions API to get commute time, which factors in traffic information.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/SamLewis0602/MMM-Traffic.git`. A new folder will appear, navigate into it.
2. Execute `npm install` to install the node dependencies.

## Config
The entry in `config.js` can include the following options:


|Option|Description|
|---|---|
|`api_key`|The API key, which can be obtained [here](https://developers.google.com/maps/documentation/directions/).<br><br>**Type:** `string`<br>This value is **REQUIRED**|
|`origin`|The start location as the address or name of a location.<br>**Example:** `'Yankee Stadium'` or `'500 Main Street New York NY'`<br><br>This value is **REQUIRED**|
|`destination`|The end location as the address or name of a location.<br>**Example:** `'PNC Arena'` or `'1000 Main Street New York NY'`<br><br>This value is **REQUIRED**|
|`arrival_time`|If you want the module to give you a departure time, put a 24 hour formatted time that you would like to arrive.<br>**Example:** `'1445'`|
|`mode`|Mode of transportation.<br><br>**Default value:** `'driving'`<br>**Other Options:**`'walking' 'bicycling' 'transit'`|
|`avoid`|Set to 'tolls','highways', or 'ferries' to avoid them in the route<br><br>**Default value:** None|
|`route_name`|A nickname for the route that will appear below the route when set.<br><br>**Example:** `'Home to school'`<br>**Default value:** None|
|`show_summary`|Show the route's summary after the nickname.<br><br>**Default value:** `true` but won't show unless `route_name` is set<br>**Effect** (in bold): 'Home to school **via Route 1/Main St**'|
|`traffic_model`|Model for traffic estimation.<br><br>**Default value:** `'best_guess'`<br>**Other Options:**`'optimistic' 'pessimistic'`|
|`changeColor`|When `changeColor` is set to true, the color of the commute info will change based on traffic. If traffic increases the commute by `limitYellow`, the symbol and commute text will be yellow. An increase of `limitRed` will change the color to red. If the traffic doesn't increase the commute by at least `limitYellow`, the color will be green.<br><br>**Default value:** `false`|
|`limitYellow`|Percentage increase in commute time due to traffic to turn commute text yellow.<br><br>**Default value:** `10`|
|`limitRed`|Percentage increase in commute time due to traffic to turn commute text red.<br><br>**Default value:** `30`|
|`showGreen`|If you've set `changeColor` to true but would like the commute text to remain white instead of turn green when there's light/no traffic, set `showGreen` to false.<br><br>**Default value:** `true`|
|`interval`|How often the traffic is updated.<br><br>**Default value:** `300000 //5 minutes`|
|`loadingText`|The text used when loading the initial commute time.<br><br>**Default value:** `'Loading commute...'`|
|`prependText`|The text used in front of the commute time.<br><br>**Default value:** `'Current commute is'`|
|`summaryText`|The text used in between the route name and the route summary.<br><br>**Default value:** `'via'`|
|`arriveByText`|The text used in the route summary when `arrival_time` is set.<br><br>**Default value:** `'to arrive by'`|
|`leaveByText`|The text used in front of the time to leave when `arrival_time` is set.<br><br>**Default value:** `'Leave by'`|
|`language`|Define the commute time language.<br><br>**Example:** `en`<br>**Default value:** `config.language`|
|`showWeekend`|A boolean flag used to set if the commute time is requested at the weekend.<br><br>**Default value:** `true`|
|`allTime`|A boolean flag used to set if the commute time is requested 24hrs a day. If this is set to `false` then the `startHr` and `endHr` are used to set when the times are displayed.<br><br>**Default value:** `true`|
|`hideOffHours`|A boolean flag used to set if the module will be hidden when outside the days/times designated in `showWeekend` and `allTime`.<br><br>**Default value:** `false`|
|`startHr`|An integer used to set the hour when the commute times are first requested if `allTime` is `false`.<br>The range is `0` to `23`.<br><br>**Default value:** `7`|
|`endHr`|An integer used to set the hour when the commute times are last requested if `allTime` is `false`.<br>The range is `0` to `23`.<br><br>**Default value:** `22`|

Here is an example of an entry in `config.js`
```
{
	module: 'MMM-Traffic',
	position: 'top_left',
	classes: 'dimmed medium', //optional, default is 'bright medium', only applies to commute info not route_name
	config: {
		api_key: 'your_apikey_here',
		mode: 'driving',
		origin: '4 Pennsylvania Plaza, New York, NY 10001',
		destination: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
		arrival_time: '0800', //optional, but needs to be in 24 hour time if used.
		route_name: 'Home to Work',
		changeColor: true,
		showGreen: false,
		limitYellow: 5, //Greater than 5% of journey time due to traffic
		limitRed: 20, //Greater than 20% of journey time due to traffic
		traffic_model: 'pessimistic',
		interval: 120000, //2 minutes
		showWeekend: false,
		allTime: false
	}
},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Important Notes
- This is my first project using Node, so feel free to submit pull requests or post on the issues/wiki and I will do my best to improve the project.

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [Paul-Vincent Roll](https://github.com/paviro) for creating the [Wunderlist](https://github.com/paviro/MMM-Wunderlist) module that I used as guidance in creating this module.
