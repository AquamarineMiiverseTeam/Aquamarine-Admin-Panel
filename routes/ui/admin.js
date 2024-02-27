const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');
const permission = require("../../middleware/permissions")

route.use(permission("all"))

route.get("/audit", async (req, res) => {
    const actions = await db_con("admin_actions")
    .select("admin_actions.create_time", "admin_actions.admin", "admin_actions.action_description", "admin_actions.id", "admin_actions.action_type", "accounts.mii_hash")
    .innerJoin("accounts", "accounts.nnid", "=", "admin_actions.admin")
    .orderBy("admin_actions.create_time", "desc")

    res.render("admin/audit.ejs", {
        account : req.account[0],
        actions : actions,
        moment : moment
    })
})

module.exports = route;