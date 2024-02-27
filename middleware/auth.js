const db_con = require('../../Aquamarine-Utils/database_con');
const crypto = require("crypto");
const logger = require('./log');

async function auth(req, res, next) {
    if (req.path.includes("img") || req.path.includes("css") || req.path.includes("js")) { next(); return; }

    if (!req.cookies.password || !req.cookies.network_id) { res.render("log_in.ejs"); console.log(logger.error("No password or network_id cookie!")); return; }

    const account = (await db_con("accounts").where({nnid : req.cookies.network_id}))
    if (!account[0]) {res.sendStatus(404); return;}

    var passwordHash = crypto.createHash('sha256').update(req.cookies.password + account[0].password_salt).digest('hex');
    if (passwordHash == account[0].password_hash) {
        if (account[0].allow_admin_panel != 1) {res.sendStatus(400); console.log(logger.error(`${account[0].nnid} is trying to access the admin panel!!!!!!`)); return;}
        req.account = account;
        next()
    } else {
        res.sendStatus(400);
        console.log(logger.error("Password Mismatch!"))
    }
}

module.exports = auth