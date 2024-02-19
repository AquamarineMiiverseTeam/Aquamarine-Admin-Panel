const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');

route.get("/", async (req, res) => {
    const favorites = await db_con("favorites").orderBy("create_time", "desc")
    
    res.render("database/favorites.ejs", {
        account : req.account[0],
        favorites : favorites,
        moment : moment
    })
})

module.exports = route