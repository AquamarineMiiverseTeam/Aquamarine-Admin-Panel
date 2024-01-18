const express = require('express');
const path = require('path');
const util = require('util')
const colors = require('colors');

const con = require('../Aquamarine-Utils/database_con');
const query = util.promisify(con.query).bind(con);
const auth = require('./middleware/auth');

const app = express();
app.set('view engine', 'ejs');

const config_http = require('./config/http.json');
const config_database = require('../Aquamarine-Utils/database_config.json');

//Grab logger middleware and use it. (Logs all incoming HTTP/HTTPS requests)
const logger = require('./middleware/log');
app.use(logger);
app.use(auth);

app.use(express.static(path.join(__dirname, "../CDN_Files/")));
app.use(express.static(path.join(__dirname, "./static")));

//Grab index of all routes and set them in our express app
const routes = require('./routes/index');
app.use("/", routes.ADMIN_MAIN_UI)

//Set our app to listen on the config port
app.listen(config_http.port, () => {
    console.log("[INFO] Listening on port %d".green, config_http.port);
})
