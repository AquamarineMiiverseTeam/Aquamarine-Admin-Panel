const express = require('express')
const router = express.Router()

const body_parser = require('body-parser')

const database_query = require('../../../Aquamarine-Utils/database_query')

const con = require('../../../Aquamarine-Utils/database_con')

const util = require('util')

const query = util.promisify(con.query).bind(con)

const fs = require('fs')
const path = require('path')

const moment = require('moment');

const common = require('../../../Aquamarine-Utils/common')

router.use(body_parser.urlencoded({extended : false, limit : '150mb'}))
router.use(body_parser.json({limit : '150mb'}))
router.use(async (req, res, next) => {
    // loop through object entries and make anything thats empty into null, to avoid making existing null values into blank but non-null values
    for (var [key, value] of Object.entries(req.body)) {
        if (!value) req.body[key] = null;
    }

    next();
})

router.get('/', async (req, res) => {
    res.render('admin.ejs', {
        account : req.account[0],
        con : con
    })
})

// accounts overview
router.get('/accounts', async (req, res) => {
    var accounts = await database_query.getAccounts('desc', null)

    res.render('admin_accounts.ejs', {
        accounts : accounts,
        account : req.account[0],
        con : con
    })
})

// account create/edit pages
router.get('/accounts/new', async(req, res) => {
    res.render('admin_account_create', {
        account : req.account[0]
    })
})

router.get('/accounts/:id', async(req, res) => {
    var account = await database_query.getAccount(req.params.id)
    
    res.render('admin_account_edit', {
        editAccount : account,
        account : req.account[0]
    })
})

// account creation/editing/deletion endpoints
router.post('/accounts/new', async (req, res) => {

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
    
    res.sendStatus(201);
})

router.put('/accounts/:id', async (req, res) => {
    var original_account = (await query("SELECT * FROM accounts WHERE id=?", req.params.id))[0];
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
        await query(`UPDATE accounts SET pid=?, nnid=?, mii=?, mii_name=?, mii_hash=?, bio=?, admin=?, banned=?, 3ds_service_token=?, wiiu_service_token=?, game_experience=?, language=?, country=?, favorite_post=?, relationship_visible=?, allow_friend=?, empathy_notification=?, pronouns=?, community_settings=?, tester=? WHERE id=?`,
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
        req.body.tester,
        req.params.id]);    

        await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "altered_account", editString.trim()]);
    }
    
    res.sendStatus(200);
})

router.delete("/accounts/:id", async (req, res) => {
    var original_account = await query("SELECT * FROM accounts WHERE id=?", req.params.id);
    await query("DELETE FROM accounts WHERE id=?", req.params.id);
    await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "deleted_account", `${original_account.nnid ? original_account.nnid : "DUMMY"} (ID: ${req.params.id})`]);

    res.sendStatus(200);
})


// communities overview
router.get('/communities', async (req, res) => {

    var communities = await database_query.getCommunities('desc', null, 'all')
    var account = req.account[0]

    res.render('admin_communities.ejs', {
        communities : communities,
        account : account,
        con : con
    })
})

// community create/edit/post viewing pages
router.get('/communities/new', (req, res) => {
    res.render('admin_community_create', {
        account : req.account[0]
    })
})

router.get('/communities/:id', async(req, res) => {
    var community = (await database_query.getCommunity(req.params.id, req))
    
    res.render('admin_community_edit', {
        community : community,
        account : req.account[0]
    })
})

router.get('/communities/:id/posts', async (req, res) => {
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
        community : community
    });
})

// community creation/editing/deletion endpoints
router.post('/communities/new', async (req, res) => {
    var id = await query(`INSERT INTO communities (name, description, app_data, pid, title_ids, platform, post_type, type, parent_community_id, ingame_only) VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [req.body.name, req.body.desc, req.body.app_data, (req.body.pid) ? req.body.pid : 0, req.body.title_ids, req.body.platform, req.body.post_type, req.body.type, (req.body.parent_community_id) ? req.body.parent_community_id : 0, (req.body.ingame_only) ? req.body.ingame_only : 0]);

    var editString = `${req.body.name} (ID: ${id.insertId})\n\n`;

    editString += `Description: ${req.body.desc}\n`;
    editString += `App Data: ${req.body.app_data}\n`;
    editString += `Parent Community ID: ${req.body.parent_community_id}\n`;
    editString += `PID: ${req.body.pid}\n`;
    editString += `Title IDs: ${req.body.title_ids}\n`;
    editString += `Ingame Only: ${req.body.ingame_only}\n`;
    editString += `Platform: ${req.body.platform}\n`;
    editString += `Community Type: ${req.body.type}\n`;
    editString += `Post Type: ${req.body.post_type}\n`;

    await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "created_community", editString]);

    if (req.body.icon) {
        fs.writeFileSync(__dirname + `/../../../CDN_Files/img/icons/${id.insertId}.jpg`, req.body.icon, 'base64');
    }
    else {
        fs.copyFileSync( __dirname + `/../../../CDN_Files/img/icons/default.jpg`, __dirname + `/../../../CDN_Files/img/icons/${id.insertId}.jpg`);
    }

    if (req.body.banner_wup) {
        fs.writeFileSync(__dirname + `/../../../CDN_Files/img/banners-wup/${id.insertId}.jpg`, req.body.banner_wup, 'base64');
    }

    if (req.body.banner_ctr) {
        fs.writeFileSync(__dirname + `/../../../CDN_Files/img/banners-ctr/${id.insertId}.jpg`, req.body.banner_ctr, 'base64');
    }

    res.sendStatus(201);

    await common.discord.createNewCommunityWebhookMessage(id.insertId)
})

router.put('/communities/:id', async (req, res) => {
    var original_community = (await query("SELECT * FROM communities WHERE id=?", req.params.id))[0];
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

    if (req.body.icon) {
        fs.writeFileSync(__dirname + `/../../../CDN_Files/img/icons/${req.params.id}.jpg`, req.body.icon, 'base64');
        editString += "Community Icon Changed\n";
    }

    if (req.body.banner_wup) {
        fs.writeFileSync(__dirname + `/../../../CDN_Files/img/banners-wup/${req.params.id}.jpg`, req.body.banner_wup, 'base64');
        editString += "Community Banner (WUP) Changed\n";
    }

    if (req.body.banner_ctr) {
        fs.writeFileSync(__dirname + `/../../../CDN_Files/img/banners-ctr/${req.params.id}.jpg`, req.body.banner_ctr, 'base64');
        editString += "Community Banner (CTR) Changed\n"
    }

    if (editString != ogEditString) {
        await query(`UPDATE communities SET name=?, description=?, app_data=?, pid=?, title_ids=?, platform=?, post_type=?, type=?, parent_community_id=?, ingame_only=?, special_community=? WHERE id=?`, 
        [req.body.name, req.body.desc, req.body.app_data, req.body.pid, req.body.title_ids, req.body.platform, req.body.post_type, req.body.type, req.body.parent_community_id, req.body.ingame_only, req.body.special_community, req.params.id]);
    
        await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "altered_community", editString.trim()]);
    }

    res.sendStatus(200);
})

router.delete("/communities/:id", async (req, res) => {
    var original_community = await query("SELECT * FROM communities WHERE id=?", req.params.id);
    await query("DELETE FROM communities WHERE id=?", req.params.id);
    await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "deleted_community", `${original_community.name} (ID: ${req.params.id})`]);

    res.sendStatus(200)
})

// post moderation endpoint
router.post('/posts/:post_id/moderate', async (req, res) => {
    await query(`UPDATE posts SET moderated=(moderated ^ 1) WHERE id=?`, req.params.post_id);
    await query("INSERT INTO admin_actions (admin, action_type, action_description) VALUES(?,?,?)", [req.account[0].nnid, "moderated_post", req.params.post_id]);

    res.sendStatus(200);
})

// audit logs endpoint
router.get('/audit', async (req, res) => {
    var actions = await query(`
    SELECT * 
    FROM admin_actions 
    INNER JOIN accounts
    ON accounts.nnid = admin_actions.admin
    ORDER BY admin_actions.create_time DESC`)

    res.render('admin_audit.ejs', {
        account : req.account[0],
        actions : actions,
        moment : moment
    })
})

module.exports = router