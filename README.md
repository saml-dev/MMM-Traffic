# MMM-Wunderlist
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can display your Wunderlist todos. You can add multiple instances with different lists. Only one account supported.

## Usage
The entry in config.js can look like the following. You will need an `access_token` and a `client_id`, you can obtain them [here](https://developer.wunderlist.com/apps/new).

```
{
	module: 'MMM-Wunderlist',
	position: "top_right",
	header: 'Wunderlist',
	config: {
		access_token: "your_token_here",
		client_id: "your_client_id_here",
		//Array with the lists you want to display. Example: ["inbox", "ViRO Entertainment"]
		lists: ["inbox"]
	}
},
```

## Important Notes
- The node side of this script is proably not really efficient, I am glad it works at all. If you want to improve it, I am happy about pull requests!

## Dependencies
- [request](https://www.npmjs.com/package/request) (npm install request)

## Licenses
The MIT License (MIT)

Copyright (c) 2016 Paul-Vincent Roll

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.