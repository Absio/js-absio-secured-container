# CLI Static User Management Example V1.0.0
This tool is helpful in creating and deleting users as well as managing users authenication and backup credentials.

## Running the CLI application
1. Move to the root directory of the source code (same location the README.md resides).
1. Install - run command below.<br>
_npm install_
1. Start - run the command below.  Note: this will run the a single command.  This does not start a session.<br>
_node src/containerutil.js 'command from list' 'parameters'_
1. List of available commands
    * register - registers a new user and returns user ID after successful operation
    * login - perform a login to test your password and passphrase
    * deleteuser - deletes the user
    * getreminder - returns the publicly accessible reminder for the user's passphrase
    * changecredentials - changes credentials for the user
    * needtosync - checks if the Key File needs to be synced
    * syncaccount - pulls the Key File from the server and loads it into memory and optionally into the cache
1. Help - to learn about the attributes for a particular command, add -h after the command as the only parameter
_node src/containerutil.js 'register' -h_
