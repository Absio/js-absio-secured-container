# CLI CRUD Utility Example V1.0
 
## Changing the server instance
* Open the file _./index.js_
* Edit line 15 changing the server to the desired value (the first parameter in initialize is the server)<br>
_initialize(**'https://sandbox.absio.com'**, 'c6b769ac-f7e9-43eb-96e2-dd6e07756149')_
 
## Setting your API Key
* Open the file _./index.js_
* Edit line 15 changing the API Key to the desired value (the second parameter in initialize is the API Key)
_initialize('https://sandbox.absio.com', **'c6b769ac-f7e9-43eb-96e2-dd6e07756149'**)_
 

## Running the CLI application
1. Install - run command below.<br>
_npm install_
1. Start - run the command below.  Note: this will run the local server with the web app started (opens a browser).<br>
_node index.js_