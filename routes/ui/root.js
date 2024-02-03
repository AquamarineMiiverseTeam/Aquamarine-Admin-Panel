const express = require('express')
const route = express.Router()

const body_parser = require('body-parser')

const database_query = require('../../../Aquamarine-Utils/database_query')

const con = require('../../../Aquamarine-Utils/database_con')

const util = require('util')

const pm2 = require("pm2")
const query = util.promisify(con.query).bind(con)

const fs = require('fs')
const path = require('path')

const moment = require('moment');

const common = require('../../../Aquamarine-Utils/common');

route.get("/", async (req, res) => {
    res.render("admin.ejs")
})

module.exports = route