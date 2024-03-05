const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');
const permission = require("../../middleware/permissions")

route.get("/api_calls", async (req, res) => {
    const api_calls = (await db_con.raw("SELECT DATE(create_time) AS forDate, COUNT(*) AS numAPICalls FROM api_calls GROUP BY DATE(create_time) ORDER BY forDate"))[0]
    const api_calls_num = (await db_con("api_calls").count("id"))[0]["count(`id`)"]

    const api_calls_notifications = (await db_con.raw("SELECT DATE(create_time) AS forDate, COUNT(*) AS numAPICalls FROM api_calls WHERE url LIKE '%notifications%' GROUP BY DATE(create_time) ORDER BY forDate"))[0]

    res.render("analytics/api.ejs", {
        account : req.account[0],
        api_calls : api_calls,
        api_calls_num : api_calls_num,
        api_calls_notifications : api_calls_notifications
    })
})

module.exports = route