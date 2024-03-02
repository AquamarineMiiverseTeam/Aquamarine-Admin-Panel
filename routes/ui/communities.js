const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');
const permission = require("../../middleware/permissions")

route.get("/", async (req, res) => {
    if (req.get("x-inline-pjax")) {
        if (req.query['search']) {
            const communities = await db_con("communities").whereILike("name", `%${req.query['search']}%`);

            res.send(communities);

            return;
        }

        const communities = await db_con("communities").orderBy("create_time", "desc").offset(req.query['offset']).limit(req.query['limit'])

        res.send(communities);

        return;
    }

    const num_communities = (await db_con("communities").count("id"))[0]['count(`id`)']
    const communities = await db_con("communities").orderBy("create_time", "desc")

    res.render('admin_communities.ejs', {
        communities : communities,
        num_communities : num_communities,
        account : req.account[0]
    })
})

route.get("/new", async (req, res) => {
    res.render('admin_community_create',{
        account : req.account[0]
    })
})

route.get("/:id", async (req, res) => {
    const community = (await db_con("communities").where({id : req.params.id}))[0]
    
    res.render('admin_community_edit', {
        community : community,
        account : req.account[0]
    })
})

route.get("/:id/posts", async (req, res) => {
    const posts = await db_con("posts")
    .select("posts.*", "accounts.id as account_id", "accounts.mii_hash", "accounts.nnid", "accounts.mii_name", "accounts.admin")
    .where({community_id : req.params.id})
    .innerJoin("accounts", "accounts.id", "=", "posts.account_id")
    .orderBy("create_time", "desc")

    const community = (await db_con("communities").where({id : req.params.id}))[0]

    res.render('admin_community_posts', {
        posts : posts,
        account : req.account[0],
        community : community,
        moment : moment
    });
})

module.exports = route