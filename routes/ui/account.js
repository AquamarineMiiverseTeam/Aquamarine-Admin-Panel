const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');
const permission = require("../../middleware/permissions")

route.use(permission("all"))

route.get("/", async (req, res) => {
    const accounts = await db_con("accounts").orderBy("create_time", "desc")

    res.render('admin_accounts.ejs', {
        accounts : accounts,
        account : req.account[0],
        moment : moment
    })
})

route.get("/new", async (req, res) => {
    res.render('admin_account_create', {
        account : req.account[0]
    })
})

route.get("/:id", async (req, res) => {
    const account = (await db_con("accounts").where({id : req.params.id}))[0]
    
    res.render('admin_account_edit', {
        editAccount : account,
        account : req.account[0]
    })
})

module.exports = route