
# NodeJS Shopping Cart - NodeJS, Express, Express-Session, Express handlebars (hbs)

### Run locally on your machine
You need to have installed Node and NPM.

Clone this repository
``` shell
git clone https://github.com/joepusateri/nodejs-shopping-cart.git
cd ./nodejs-shopping-cart
```
In LaunchDarkly, find your SDK Key. 
From: https://app.launchdarkly.com/settings/projects/
choose a project to see the SDK Key. Copy it.

Edit `./routes/index.js` and modify line 6 to enter the SDK Key:
`const sdkKey = 'ENTER-LAUNCHDARKLY-SDK-KEY';`

Create a new feature flag with the settings:
- Name: any name
- Key: `display-images`
- Flag variations: `Boolean`
- Variation 1:
	- Value: true
	- Name: `Show small image` 
- Variation 2:
	- Value: false
	- Name: `No image`
- Default Variations:
	- ON: true
	- OFF: false

Save the flag.

On the Targeting tab, create a new Rule:
- Context kind: `user`
- Attribute: `email`
- Operator: `contains`
- Values: `gmail.com`

On the Variations tab, ensure that the Default variations at the bottom are:
- ON: `Show small image`
- OFF: `No image` 


Review and Save the flag.

Now that your LaunchDarkly setup is complete, you can run the server. 
First, install dependencies
``` shell
npm install
```

Start NodeJS server at http://localhost:3000
``` shell
npm start
```
Enable the `display-images` flag in LaunchDarkly, and refresh the page. No changes should be visible.

The switch will target only those users logged in with an email that contains `gmail.com`

Log in by clicking the Login link and enter an email address. First try one with `gmail.com` and you should see images of each item on the home page.

Change the email address (to blank or not gmail) or turn off the flag and refresh to see the images disappear.


### Technologies 
NodeJS, Express, Express-Session, Nodemon, hbs - Express.js view engine for handlebars.js

