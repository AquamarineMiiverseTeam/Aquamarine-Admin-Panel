const express = require('express')
const route = express.Router()

const body_parser = require('body-parser')

const database_query = require('../../../Aquamarine-Utils/database_query')

const con = require('../../../Aquamarine-Utils/database_con')

const util = require('util')

const query = util.promisify(con.query).bind(con)

const fs = require('fs')
const path = require('path')

const moment = require('moment');

const common = require('../../../Aquamarine-Utils/common')

route.get("/", async (req, res) => {
    var actions = await query(`
    SELECT * 
    FROM admin_actions 
    INNER JOIN accounts
    ON accounts.nnid = admin_actions.admin
    ORDER BY admin_actions.create_time DESC`)

    res.render('admin_audit.ejs', {
        account : req.account[0],
        actions : actions,
        moment : moment
    })
})

module.exports = route