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
    var communities = await database_query.getCommunities('desc', null, 'all')
    var account = req.account[0]

    res.render('admin_communities.ejs', {
        communities : communities,
        account : account,
        con : con
    })
})

route.get("/new", async (req, res) => {
    res.render('admin_community_create', {
        account : req.account[0]
    })
})

route.get("/:id", async (req, res) => {
    var community = (await database_query.getCommunity(req.params.id, req))
    
    res.render('admin_community_edit', {
        community : community,
        account : req.account[0]
    })
})

route.get("/:id/posts", async (req, res) => {
    const posts = await query("SELECT * FROM posts WHERE community_id=? ORDER BY id DESC", req.params.id)
    const community = await database_query.getCommunity(req.params.id, req);

    for (let i = 0; i < posts.length; i++) {
        const account = (await query("SELECT * FROM accounts WHERE id=?", posts[i].account_id))[0];

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

        posts[i].is_empathied_by_user = (await query("SELECT * FROM empathies WHERE post_id=? AND account_id=?", [posts[i].id, req.account[0].id])).length;
        posts[i].empathy_count = (await query("SELECT * FROM empathies WHERE post_id=?", posts[i].id)).length;
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