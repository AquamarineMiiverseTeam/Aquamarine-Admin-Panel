const express = require('express')
const route = express.Router()
const pm2 = require("pm2")

route.get("/", async (req, res) => {
    pm2.connect((err) => {
        pm2.list((err, list) => {
            console.log(list)
            res.render("pm2/manager.ejs",{
                account : req.account[0],
                pm2_list : list
            })
        })        
    })
})

module.exports = route