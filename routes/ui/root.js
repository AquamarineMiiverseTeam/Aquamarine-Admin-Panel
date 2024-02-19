const express = require('express')
const route = express.Router()

route.get("/", async (req, res) => {
    res.render("admin.ejs",{
        account : req.account[0]
    })
})

module.exports = route