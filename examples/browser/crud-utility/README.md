# CRUD Utility Web Version Example V1.0
 
## Changing the server instance
* Open the file _src/index.js_
* Edit line 15 changing the server to the desired value (the first parameter in initialize is the server)<br>
_initialize(**'https://sandbox.absio.com'**, '89df1450-458e-4d43-bf42-5c700a4648ce')_
 
## Setting your API Key
* Open the file _src/index.js_
* Edit line 15 changing the API Key to the desired value (the second parameter in initialize is the API Key)
_initialize('https://sandbox.absio.com', **'89df1450-458e-4d43-bf42-5c700a4648ce'**)_
 

## Running the web application
1. Install - run command below.<br>
_npm install_
1. Start - run the command below.  Note: this will run the local server with the web app started (opens a browser).<br>
_npm start_