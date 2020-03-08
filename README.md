# MMM-Traffic
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). It can display commute time between two given addresses by car, walking, bicycling, or transit. The module uses the Google Maps Directions API to get commute time, which factors in traffic information.

Table of Contents
=================

   * [MMM-Traffic](#mmm-traffic)
      * [Installation](#installation)
      * [Dependencies](#dependencies)
      * [Configuration](#configuration)
         * [Required](#required)
         * [Basic Options](#basic-options)
         * [Translation](#translation)
         * [Waypoints/Stops](#waypointsstops)
         * [Show Route Information](#show-route-information)
         * [Show Departure Time](#show-departure-time)
         * [Per-Day Customization](#per-day-customization)
         * [Change Color based on Traffic](#change-color-based-on-traffic)
         * [Sleep Hours](#sleep-hours)

## Installation
Navigate into your MagicMirror's `modules` folder and execute these commands:
```shell
git clone https://github.com/SamLewis0602/MMM-Traffic.git
cd MMM-Traffic
npm install
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Configuration

### Required
This module has a LOT of customization, don't let that intimidate you! All that's required to get up and running are these three config options:

|Option|Description|Type|
|---|---|---|
|`api_key`|The API key, which can be obtained [here](https://developers.google.com/maps/documentation/directions/).|string|
|`origin`|The name or address of the starting location.|string|
|`destination`|The name or address of the destination location.|string|

### Basic Options
|Option|Description|Type|Default Value|Supported Options|
|---|---|---|---|---|
|`language`|Define the commute time language.|string|`config.language`| Any language string
|`mode`|Mode of transportation.|string|`'driving'`| `'driving'`<br>`'walking'`<br>`'bicycling'`<br>`'transit'`|
|`avoid`|Avoid certain types of transportation on the route.|string|`''`|`'tolls'`<br>`'highways'`<br>`'ferries'`|
|`traffic_model`|Model for traffic estimation.|string|`'best_guess'`|`'best_guess'`<br>`'optimistic'`<br>`'pessimistic'`|
|`interval`|How often the traffic is updated in milliseconds.|integer|`300000`<br>(5 minutes)||

### Translation
Use these config options to translate the module's various text to your language.
|Option|Description|Type|Default Value|
|---|---|---|---|
|`loadingText`|The text used when loading the initial commute time.|string|`'Loading commute...'`|
|`prependText`|The text used in front of the commute time.|string|`'Current commute is'`|

### Waypoints/Stops
|Option|Description|Type|Example|
|---|---|---|---|
|`waypoints`|A pipe separated list of locations that you want your route to pass through.|string|<code>'Disneyworld&#124;Universal Studios'</code>

### Show Route Information
|Option|Description|Type|Default Value|Supported Options|
|---|---|---|---|---|
|`showRouteInfo`|Set to true to show info about your route below the commute time.|boolean|`false`|`true`<br>`false`|
|`showRouteInfoText`|Text displayed when `showRouteInfo` is `true`. Supports token replacement.|string|`'{routeName} via {summary}'`|Supported tokens: <br>`{routeName}`<br>`{summary}`<br>`{arrivalTime}`<br>`{origin}`<br>`{destination}`<br>`{detailedSummary}`<br><br>`{summary}` not supported when `mode == 'transit'`
|`route_name`|A nickname for the route used in combination with `showRouteInfoText`|string|None|any string i.e. `'Home to Work'`|

### Show Departure Time
Use this option to show what time you need to leave to arrive on time, rather than the duration.
|Option|Description|Type|Example|
|---|---|---|---|
|`arrival_time`|24 hour formatted arrival time with no separator|string|`'0930'`|
### Per-Day Customization
|Option|Description|Type|
|---|---|---|
|`mon_destination`<br>`tues_destination`<br>`wed_destination`<br>`thurs_destination`<br>`fri_destination`<br>`sat_destination`<br>`sun_destination`|Used to specify a different destination for particular days of the week.|string|None|
|`mon_arrival_time`<br>`tues_arrival_time`<br>`wed_arrival_time`<br>`thurs_arrival_time`<br>`fri_arrival_time`<br>`sat_arrival_time`<br>`sun_arrival_time`|Used to set different arrival times to match your day-specific destinations.|string|`'1445'`|
|`mon_route_name`<br>`tues_route_name`<br>`wed_route_name`<br>`thurs_route_name`<br>`fri_route_name`<br>`sat_route_name`<br>`sun_route_name`|Used to set route names to match your day-specific destinations.|string

### Change Color based on Traffic
|Option|Description|Type|Default
|---|---|---|---|
|`changeColor`|Set to `true` to change the color of the module based on traffic. See other options for customization.|boolean|`false`
|`limitYellow`|Percentage increase in commute time due to traffic to turn commute text yellow.|integer|`10`|
|`limitRed`|Percentage increase in commute time due to traffic to turn commute text red.|integer|`30`|
|`showGreen`|Set to `false` to leave the module white when there's no traffic.|boolean|`true`|
|`colorOnlySymbol`|Set to `true` to only apply the color change to the symbol, leaving the text white.|boolean|`false`|

### Sleep Hours
Use these options to only update your commute information when you need it. This saves bandwidth and API calls.

|Option|Description|Type|Default
|---|---|---|---|
|`showWeekend`|Used to set if the commute time is requested at the weekend.|boolean|`true`|
|`allTime`|Used to set if the commute time is requested 24hrs a day. If this is set to `false` then the `startHr` and `endHr` are used to set when the times are displayed.|boolean|`true`|
|`startHr`|Used to set the hour when the commute times are first requested if `allTime` is `false`.<br>The range is `0` to `23`.|integer|`7`|
|`endHr`|Used to set the hour when the commute times are last requested if `allTime` is `false`.<br>The range is `0` to `23`.|integer|`22`|
|`hideOffHours`|Used to set if the module will be hidden when outside the days/times designated in the above 4 parameters.|boolean|`false`|

Here is an example of an entry in `config.js`
```js
{
	module: "MMM-Traffic",
	position: "top_left",
	classes: "dimmed medium",  //optional, default is "bright medium", only applies to commute info not route_name
	config: {
		api_key: "your_apikey_here",
		mode: "driving",
		origin: "4 Pennsylvania Plaza, New York, NY 10001",
		destination: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
		mon_destination: "116th St & Broadway, New York, NY 10027",
		fri_destination: "1 E 161st St, Bronx, NY 10451",
		arrival_time: "0800",  // optional, but needs to be in 24 hour time if used.
		route_name: "Home to Work",
		changeColor: true,
		showGreen: false,
		limitYellow: 5,  // Greater than 5% of journey time due to traffic
		limitRed: 20,  // Greater than 20% of journey time due to traffic
		traffic_model: "pessimistic",
		interval: 120000  // 2 minutes
	}
},
```
