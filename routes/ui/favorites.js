const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');
const permission = require("../../middleware/permissions")

route.use(permission("all"))

route.get("/", async (req, res) => {
    const favorites = await db_con("favorites")
    .select("favorites.*", "accounts.mii_hash", "accounts.nnid", "communities.name as community_name")
    .innerJoin("accounts", "accounts.id", "=", "favorites.account_id")
    .innerJoin("communities", "communities.id", "=", "favorites.community_id")
    .orderBy("favorites.create_time", "desc")
    
    res.render("database/favorites.ejs", {
        account : req.account[0],
        favorites : favorites,
        moment : moment
    })
})

module.exports = route