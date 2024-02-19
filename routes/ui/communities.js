const express = require('express')
const route = express.Router()

const db_con = require('../../../Aquamarine-Utils/database_con')

const moment = require('moment');

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
    const posts = await db_con("posts").where({community_id : req.params.id}).orderBy("create_time", "desc")
    const community = await db_con("communities").where({id : req.params.id})

    for (let i = 0; i < posts.length; i++) {
        const account = (await db_con("accounts").where({id : posts[i].account_id}))[0]

        var mii_face;

        switch (posts[i].feeling_id) {
            case 0:
                mii_face = "normal_face";
                break;
            case 1:
                mii_face = "happy_face";
                break;
            case 2:
                mii_face = "like_face";
                break;
            case 3:
                mii_face = "surprised_face";
                break;
            case 4:
                mii_face = "frustrated_face";
                break;
            case 5:
                mii_face = "puzzled_face";
                break;
            default:
                mii_face = "normal_face";
                break;
        }

        posts[i].mii_image = `http://mii-images.account.nintendo.net/${account.mii_hash}_${mii_face}.png`;
        posts[i].mii_name = account.mii_name;
        posts[i].admin = account.admin;
    }

    res.render('admin_community_posts', {
        posts : posts,
        account : req.account[0],
        community : community,
        moment : moment
    });
})

module.exports = route