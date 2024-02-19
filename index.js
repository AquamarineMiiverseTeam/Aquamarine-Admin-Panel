const express = require('express');
const path = require('path');
const colors = require('colors');

const db_con = require('../Aquamarine-Utils/database_con');
const auth = require('./middleware/auth');

const app = express();
app.set('view engine', 'ejs');

const config_http = require('./config/http.json');
const cookieparser = require("cookie-parser")

//Grab logger middleware and use it. (Logs all incoming HTTP/HTTPS requests)
const logger = require('./middleware/log');

const routes = require("./routes/index");

app.use(logger.http_log);
app.use(cookieparser());
app.use(auth);

app.use(express.static(path.join(__dirname, "../CDN_Files/")));
app.use(express.static(path.join(__dirname, "./static")));

//Grab index of all routes and set them in our express app
logger.log("Creating all portal routes.");

for (const route of routes) {
    app.use(route.path, route.route)
}

logger.log("Creating 404 error handler.");

app.use((req, res, next) => {
    //If the requested file isn't avaliable, then return a JSON containing the error.
    if (req.path.includes("js") || req.path.includes("css") || req.path.includes("img") || req.path.includes("lang")) { res.send({error : "The requested file could not be found", file : req.path}); return;}

    //If the page just couldn't be found altogether, return a 404 error page.
    res.render("error/error_404",{
        account : req.account[0]
    });

    return;
});

//Set our app to listen on the config port
app.listen(config_http.port, async () => {
    console.log("[INFO] Listening on port %d".green, config_http.port);
})
