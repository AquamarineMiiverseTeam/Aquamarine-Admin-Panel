const express = require('express')
const route = express.Router()

const body_parser = require('body-parser')

const db_con = require('../../Aquamarine-Utils/database_con')
const knex = require("knex")

const fs = require('fs')

route.use(body_parser.urlencoded({extended : false, limit : '150mb'}))
route.use(body_parser.json({limit : '150mb'}))

route.use(async (req, res, next) => {
    // loop through object entries and make anything thats empty into null, to avoid making existing null values into blank but non-null values
    for (var [key, value] of Object.entries(req.body)) {
        if (!value) req.body[key] = null;
    }

    next();
})


// post moderation endpoint
route.post('/posts/:post_id/moderate', async (req, res) => {
    await db_con.raw("UPDATE posts SET moderated=(moderated^1) WHERE id=? ", req.params.post_id)

    await db_con("admin_actions").insert({
        admin : req.account[0].nnid,
        action_type : "moderated_post",
        action_description : req.params.post_id
    })

    res.sendStatus(200);
})

route.delete("/communities/:id", async (req, res) => {
    await db_con("communities").del().where({id : req.params.id})

    await db_con("admin_actions").insert({
        admin : req.account[0].nnid,
        action_type : "deleted_community",
        action_description : req.params.id
    })

    res.status(200).send({success : 1, header : "Deleted Community Successfully!", message : " "});
})

route.put('/communities/:id', async (req, res) => {
    var original_community = (await db_con("communities").where({id : req.params.id}))[0]
    var editString = original_community.name == req.body.name ? original_community.name : `${original_community.name} -> ${req.body.name}`;
    editString += ` (ID: ${original_community.id})\n\n`;

    var ogEditString = editString;

    if (original_community.name != req.body.name) editString += `Name: ${original_community.name} -> ${req.body.name}\n`;
    if (original_community.description != req.body.desc) editString += `Description: ${original_community.description} -> ${req.body.desc}\n`;
    if (original_community.app_data != req.body.app_data) editString += `App Data: ${original_community.app_data} -> ${req.body.app_data}\n`;
    if (original_community.parent_community_id != req.body.parent_community_id) editString += `Parent Community ID: ${original_community.parent_community_id} -> ${req.body.parent_community_id}\n`;
    if (original_community.pid != req.body.pid) editString += `PID: ${original_community.pid} -> ${req.body.pid}\n`;
    if (original_community.title_ids != req.body.title_ids) editString += `Title IDs: ${original_community.title_ids} -> ${req.body.title_ids}\n`;
    if (original_community.ingame_only != req.body.ingame_only) editString += `Ingame Only: ${original_community.ingame_only} -> ${req.body.ingame_only}\n`;
    if (original_community.platform != req.body.platform) editString += `Platform: ${original_community.platform} -> ${req.body.platform}\n`;
    if (original_community.type != req.body.type) editString += `Community Type: ${original_community.type} -> ${req.body.type}\n`;
    if (original_community.post_type != req.body.post_type) editString += `Post Type: ${original_community.post_type} -> ${req.body.post_type}\n`;
    if (original_community.special_community != req.body.special_community) editString += `Special Community: ${original_community.special_community} -> ${req.body.special_community}\n`;
    if (original_community.app_name != req.body.app_name) editString += `App Name: ${original_community.app_name} -> ${req.body.app_name}\n`;

    if (req.body.icon) {
        fs.writeFileSync(__dirname + `/../../CDN_Files/img/icons/${req.params.id}.jpg`, req.body.icon, 'base64');
        editString += "Community Icon Changed\n";
    }

    if (req.body.banner_wup) {
        fs.writeFileSync(__dirname + `/../../CDN_Files/img/banners-wup/${req.params.id}.jpg`, req.body.banner_wup, 'base64');
        editString += "Community Banner (WUP) Changed\n";
    }

    if (req.body.banner_ctr) {
        fs.writeFileSync(__dirname + `/../../CDN_Files/img/banners-ctr/${req.params.id}.jpg`, req.body.banner_ctr, 'base64');
        editString += "Community Banner (CTR) Changed\n"
    }

    if (editString != ogEditString) {
        await db_con("communities").where({id : req.params.id}).update({
            name : req.body.name,
            description : req.body.desc,
            app_data : req.body.app_data,
            pid : req.body.pid,
            title_ids : req.body.title_ids,
            platform : req.body.platform,
            post_type : req.body.post_type,
            type : req.body.type,
            parent_community_id : req.body.parent_community_id,
            ingame_only : req.body.ingame_only,
            special_community : req.body.special_community,
            app_name : req.body.app_name
        })

        await db_con("admin_actions").insert({
            admin : req.account[0].nnid,
            action_type : "altered_community",
            action_description : editString.trim()
        })
    }

    res.status(200).send({success : 1, header : "Edited Community Successful!", message : original_community.name});
})

route.post('/communities/new', async (req, res) => {
    const id = (await db_con("communities").insert({
        name : req.body.name,
        description : req.body.desc,
        app_data : req.body.app_data,
        pid : req.body.pid,
        title_ids : req.body.title_ids,
        platform : req.body.platform,
        post_type : req.body.post_type,
        type : req.body.type,
        parent_community_id : req.body.parent_community_id,
        ingame_only : req.body.ingame_only,
        app_name : req.body.app_name
    }))[0]

    var editString = `${req.body.name} (ID: ${id})\n\n`;

    editString += `Description: ${req.body.desc}\n`;
    editString += `App Data: ${req.body.app_data}\n`;
    editString += `Parent Community ID: ${req.body.parent_community_id}\n`;
    editString += `PID: ${req.body.pid}\n`;
    editString += `Title IDs: ${req.body.title_ids}\n`;
    editString += `Ingame Only: ${req.body.ingame_only}\n`;
    editString += `Platform: ${req.body.platform}\n`;
    editString += `Community Type: ${req.body.type}\n`;
    editString += `Post Type: ${req.body.post_type}\n`;
    editString += `App Name: ${req.body.app_name}\n`;

    await db_con("admin_actions").insert({
        admin : req.account[0].nnid,
        action_type : "created_community",
        action_description : editString
    })

    if (req.body.icon) {
        fs.writeFileSync(__dirname + `/../../CDN_Files/img/icons/${id}.jpg`, req.body.icon, 'base64');
    }
    else {
        fs.copyFileSync( __dirname + `/../../CDN_Files/img/icons/default.jpg`, __dirname + `/../../CDN_Files/img/icons/${id}.jpg`);
    }

    if (req.body.banner_wup) {
        fs.writeFileSync(__dirname + `/../../CDN_Files/img/banners-wup/${id}.jpg`, req.body.banner_wup, 'base64');
    }

    if (req.body.banner_ctr) {
        fs.writeFileSync(__dirname + `/../../CDN_Files/img/banners-ctr/${id}.jpg`, req.body.banner_ctr, 'base64');
    }

    res.status(201).send({success : 1, header : "Created New Community!", message : req.body.name});
})

route.put('/accounts/:id', async (req, res) => {
    var original_account = (await db_con("accounts").where({id : req.params.id}))[0]
    var editString = original_account.nnid == req.body.nnid ? original_account.nnid : `${original_account.nnid} -> ${req.body.nnid}`;
    editString += ` (ID: ${original_account.id})\n\n`;

    var ogEditString = editString;

    if (original_account.pid != req.body.pid) editString += `Account PID: ${original_account.pid} -> ${req.body.pid}\n`;
    if (original_account.nnid != req.body.nnid) editString += `Account NNID: ${original_account.nnid} -> ${req.body.nnid}\n`;
    if (original_account.mii != req.body.mii) editString += `Mii Data: ${original_account.mii} -> ${req.body.mii}\n`;
    if (original_account.mii_name != req.body.mii_name) editString += `Mii Name: ${original_account.mii_name} -> ${req.body.mii_name}\n`;
    if (original_account.mii_hash != req.body.mii_hash) editString += `Mii Hash: ${original_account.mii_hash} -> ${req.body.mii_hash}\n`;
    if (original_account.bio != req.body.bio) editString += `Bio: ${original_account.bio} -> ${req.body.bio}\n`;
    if (original_account.admin != req.body.admin) editString += `Admin: ${original_account.admin} -> ${req.body.admin}\n`;
    if (original_account.banned != req.body.banned) editString += `Banned: ${original_account.banned} -> ${req.body.banned}\n`;
    if (original_account["3ds_service_token"] != req.body.threeds_service_token) editString += `3DS Service Token: ${original_account["3ds_service_token"]} -> ${req.body.threeds_service_token}\n`;
    if (original_account.wiiu_service_token != req.body.wiiu_service_token) editString += `Wii U Service Token: ${original_account.wiiu_service_token} -> ${req.body.wiiu_service_token}\n`;
    if (original_account.game_experience != req.body.game_experience) editString += `Game Experience: ${original_account.game_experience} -> ${req.body.game_experience}\n`;
    if (original_account.language != req.body.language) editString += `Language Code: ${original_account.language} -> ${req.body.language}\n`;
    if (original_account.country != req.body.country) editString += `Country Code: ${original_account.country} -> ${req.body.country}\n`;
    if (original_account.favorite_post != req.body.favorite_post) editString += `Favorite Post(s?): ${original_account.favorite_post} -> ${req.body.favorite_post}\n`;
    if (original_account.relationship_visible != req.body.relationship_visible) editString += `Relationship Visible(?): ${original_account.relationship_visible} -> ${req.body.relationship_visible}\n`;
    if (original_account.allow_friend != req.body.allow_friend) editString += `Allow Friend: ${original_account.allow_friend} -> ${req.body.allow_friend}\n`;
    if (original_account.empathy_notification != req.body.empathy_notification) editString += `Empathy Notification: ${original_account.empathy_notification} -> ${req.body.empathy_notification}\n`;
    if (original_account.pronouns != req.body.pronouns) editString += `Pronouns: ${original_account.pronouns} -> ${req.body.pronouns}\n`;
    if (original_account.community_settings != req.body.community_settings) editString += `Community Settings: ${original_account.community_settings} -> ${req.body.community_settings}\n`;
    if (original_account.tester != req.body.tester) editString += `Tester: ${original_account.tester} -> ${req.body.tester}\n`;

    if (editString != ogEditString) {
        await db_con("accounts").where({id : req.params.id}).update({
            pid : req.body.pid,
            nnid : req.body.nnid,
            mii : req.body.mii,
            mii_name : req.body.mii_name,
            mii_hash : req.body.mii_hash,
            bio : req.body.bio,
            admin : req.body.admin,
            banned : req.body.banned,
            "3ds_service_token" : req.body.threeds_service_token,
            wiiu_service_token : req.body.wiiu_service_token,
            language : req.body.language,
            country : req.body.country,
            favorite_post : req.body.favorite_post,
            allow_friend : req.body.allow_friend,
            empathy_notification : req.body.empathy_notification,
            pronouns : req.body.pronouns,
            community_settings : req.body.community_settings,
            tester : req.body.tester
        })

        await db_con("admin_actions").insert({
            admin : req.account[0].nnid,
            action_type : "altered_account",
            action_description : editString.trim()
        })
    }
    
    res.status(200).send({success : 1, header : "Updated Account Successfully!", message : original_account.nnid});
})

route.delete("/accounts/:id", async (req, res) => {
    var original_account = await query("SELECT * FROM accounts WHERE id=?", req.params.id);
    await query("DELETE FROM posts WHERE account_id=?", req.params.id);
    await query("DELETE FROM favorites WHERE account_id=?", req.params.id);
    await query("DELETE FROM empathies WHERE account_id=?", req.params.id);
    await query("DELETE FROM accounts WHERE id=?", req.params.id);
    await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "deleted_account", `${original_account.nnid ? original_account.nnid : "DUMMY"} (ID: ${req.params.id})`]);

    res.status(200).send({success : 1, header : "Deleted Account Successfully!", message : "Deleted"});
})

route.post('/accounts/new', async (req, res) => {

    req.body.pid = req.body.pid ? req.body.pid : 0;
    req.body.nnid = req.body.nnid ? req.body.nnid : "DUMMY";
    req.body.mii = req.body.mii ? req.body.mii : "AwAAQCLrfSYhRPJQ3RFDqcJXDK3s3QAAAVRtAGkAawBlAHkAAABFAAAAAAAAAERAMgCDASNoQxg3NEUUgRIZaA0AACkAUklQbQBpAGsAZQAAAAAAAAAAAAAAAAAAAAQL"; // from pid 1738262487
    req.body.mii_name = req.body.mii_name ? req.body.mii_name : "DUMMY";
    req.body.mii_hash = req.body.mii_hash ? req.body.mii_hash : "cso8ikxbciqw";
    req.body.bio = req.body.bio ? req.body.bio : "User has not set a bio yet..";
    req.body.admin = req.body.admin ? req.body.admin : 0;
    req.body.banned = req.body.banned ? req.body.banned : 0;
    req.body.threeds_service_token = req.body.threeds_service_token ? req.body.threeds_service_token : null;
    req.body.wiiu_service_token = req.body.wiiu_service_token ? req.body.wiiu_service_token : null;
    req.body.game_experience = req.body.game_experience ? req.body.game_experience : 1;
    req.body.language = req.body.language ? req.body.language : 'en';
    req.body.country = req.body.country ? req.body.country : 'US';
    req.body.favorite_post = req.body.favorite_post ? req.body.favorite_post : null;
    req.body.relationship_visible = req.body.relationship_visible ? req.body.relationship_visible : 0;
    req.body.allow_friend = req.body.allow_friend ? req.body.allow_friend : 0;
    req.body.empathy_notification = req.body.empathy_notification ? req.body.empathy_notification : 0;
    req.body.pronouns = req.body.pronouns ? req.body.pronouns : "they/them";
    req.body.community_settings = req.body.community_settings ? req.body.community_settings : "{}";
    req.body.tester = req.body.tester ? req.body.tester : 0

    var id = await query(
    `INSERT INTO accounts (pid, nnid, mii, mii_name, mii_hash, bio, admin, banned, 3ds_service_token, wiiu_service_token, game_experience, language, country, favorite_post, relationship_visible, allow_friend, empathy_notification, pronouns, community_settings, tester) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [req.body.pid,
    req.body.nnid,
    req.body.mii,
    req.body.mii_name,
    req.body.mii_hash,
    req.body.bio,
    req.body.admin,
    req.body.banned,
    req.body.threeds_service_token,
    req.body.wiiu_service_token,
    req.body.game_experience,
    req.body.language,
    req.body.country,
    req.body.favorite_post,
    req.body.relationship_visible,
    req.body.allow_friend,
    req.body.empathy_notification,
    req.body.pronouns,
    req.body.community_settings,
    req.body.tester]);

    var editString = `${req.body.nnid} (ID: ${id.insertId})\n\n`;

    editString += `Account PID: ${req.body.pid}\n`;
    editString += `Account NNID: ${req.body.nnid}\n`;
    editString += `Mii Data: ${req.body.mii}\n`;
    editString += `Mii Name: ${req.body.mii_name}\n`;
    editString += `Mii Hash: ${req.body.mii_hash}\n`;
    editString += `Bio: ${req.body.bio}\n`;
    editString += `Admin: ${req.body.admin}\n`;
    editString += `Banned: ${req.body.banned}\n`;
    editString += `3DS Service Token: ${req.body.threeds_service_token}\n`;
    editString += `Wii U Service Token: ${req.body.wiiu_service_token}\n`;
    editString += `Game Experience: ${req.body.game_experience}\n`;
    editString += `Language Code: ${req.body.language}\n`;
    editString += `Country Code: ${req.body.country}\n`;
    editString += `Favorite Post(s?): ${req.body.favorite_post}\n`;
    editString += `Relationship Visible(?): ${req.body.relationship_visible}\n`;
    editString += `Allow Friend: ${req.body.allow_friend}\n`;
    editString += `Empathy Notification: ${req.body.empathy_notification}\n`;
    editString += `Pronouns: ${req.body.pronouns}\n`;
    editString += `Community Settings: ${req.body.community_settings}\n`;
    editString += `Tester: ${req.body.tester}\n`;

    await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "created_account", editString.trim()]);
    
    res.status(201).send({success : 1, header : "Created New Account!", message : req.body.nnid});
})

module.exports = route