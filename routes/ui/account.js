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
    var accounts = await database_query.getAccounts('desc', null)

    res.render('admin_accounts.ejs', {
        accounts : accounts,
        account : req.account[0],
        con : con,
        moment : moment
    })
})

route.get("/new", async (req, res) => {
    res.render('admin_account_create', {
        account : req.account[0]
    })
})

route.get("/:id", async (req, res) => {
    var account = await database_query.getAccount(req.params.id)
    
    res.render('admin_account_edit', {
        editAccount : account,
        account : req.account[0]
    })
})

module.exports = route