const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');
const permission = require("../../middleware/permissions")

route.use(permission("all"))

route.get("/", async (req, res) => {
    const empathies = await db_con("empathies")
    .select("empathies.*", "accounts.mii_hash", "accounts.nnid")
    .innerJoin("accounts", "accounts.id", "=", "empathies.account_id")
    .orderBy("create_time", "desc")
    
    res.render("database/empathies.ejs", {
        account : req.account[0],
        empathies : empathies,
        moment : moment
    })
})

module.exports = route