var pjax = new Pjax({
    selectors: [".wrapper", ".alerts"],
    elements : "a"
})

document.addEventListener("pjax:send", () => {
    showLoading(true);
})

document.addEventListener("pjax:complete", () => {
    showLoading(false);
    console.log("pjax complete");
    offset = 0;

    if (window.location.pathname.includes("/api_calls")) {
        init_data()
    }
})

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(document.querySelector(".nav"))
    const nav_options = document.querySelectorAll("li a[data-selectable]");

    for (const element of nav_options) {
        element.addEventListener("click", (e) => {
            for (const element of nav_options) {
                element.parentElement.classList.remove("active")
            }

            element.parentElement.classList.add("active")
        })
    }
})

function showLoading(toggle) {
    var loadingSymbol = document.querySelector(".loading");
    if (toggle) {
        loadingSymbol.style.display = "block";
    } else
        loadingSymbol.style.display = "none";
}

function log_in() {
    const password = document.querySelector('input[name="password"]').value
    const network_id = document.querySelector('input[name="network_id"]').value

    document.cookie = `password=${password}`;
    document.cookie = `network_id=${network_id}`;

    pjax.loadUrl("/");
}

function confirmDeletionCommunity(id) {
    if (confirm("Are you sure about deleting this community?") == true) {
        document.querySelector(`button[communityid_delete='${id}']`).style.display = "none !important"
        document.querySelector(`button[communityid_confirm='${id}']`).style.display = "block"
    }
}

function confirmDeletionAccount(id) {
    if (confirm("Are you sure about deleting this account?") == true) {
        document.querySelector(`button[accountid_delete='${id}']`).style.display = "none"
        document.querySelector(`button[accountid_confirm='${id}']`).style.display = "block"
    }
}

async function moderatePost(id) {
    showLoading(true);
    document.querySelector(`input[type=checkbox][postid="${id}"]`).disabled = true

    fetch(`/api/posts/${id}/moderate`, {
        method: "POST"
    }).then(res => {
        if (res.status === 200) {
            showLoading(false);
            document.querySelector(`input[type=checkbox][postid="${id}"]`).disabled = false
        } else {
            showLoading(false);
            alert(`Error with moderating post: ${id}!!!`)
        }
    })
}

const readUploadedFile = (inputFile) => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(inputFile);
    });
};


async function submitEditedCommunity() {
    const fileReader = new FileReader();

    const name = document.getElementById('name').value
    const desc = document.getElementById('desc').value
    const title_ids = document.getElementById('title_ids').value
    const pid = document.getElementById('pid').value
    const app_data = document.getElementById('app_data').value
    const platform = document.getElementById('platform').value
    const post_type = document.getElementById('post_type').value
    const type = document.getElementById('type').value
    const ingame_only = document.getElementById('ingame_only').value
    const parent_community_id = document.getElementById('parent_community_id').value
    const special_community = document.getElementById('special').value

    var icon_dom = document.getElementById("icon")
    var banner_ctr_dom = document.getElementById("banner-ctr")
    var banner_wup_dom = document.getElementById("banner-wup")

    var icon
    var banner_ctr
    var banner_wup

    if (icon_dom.files[0]) {
        icon = (await readUploadedFile(icon_dom.files[0])).slice(23, Infinity)
    }

    if (banner_ctr_dom.files[0]) {
        banner_ctr = (await readUploadedFile(banner_ctr_dom.files[0])).slice(23, Infinity)
    }

    if (banner_wup_dom.files[0]) {
        banner_wup = (await readUploadedFile(banner_wup_dom.files[0])).slice(23, Infinity)
    }

    const body = {
        name: name,
        desc: desc,
        title_ids: title_ids,
        pid: pid,
        app_data: app_data,
        platform: platform,
        post_type: post_type,
        type: type,
        parent_community_id: parent_community_id,
        ingame_only: ingame_only,
        special_community: special_community,
        icon: icon,
        banner_ctr: banner_ctr,
        banner_wup: banner_wup
    }

    console.log(body)

    showLoading(true);

    fetch(`/api/communities/${document.querySelector(".wrapper").getAttribute("data-community-id")}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 200) {
            showLoading(false);
            var resp = await res.json()
            console.log("pjax before")
            await pjax.loadUrl("/communities");
            console.log("pjax after")
            console.log(document.querySelector(".alert-info"))
        } else {
            showLoading(false);
            console.log(`Status recieved ${res.status}`)
        }
    })
}

async function submitNewCommunity() {
    const fileReader = new FileReader();

    const name = document.getElementById('name').value
    const desc = document.getElementById('desc').value
    const title_ids = document.getElementById('title_ids').value
    const pid = document.getElementById('pid').value
    const app_data = document.getElementById('app_data').value
    const platform = document.getElementById('platform').value
    const post_type = document.getElementById('post_type').value
    const type = document.getElementById('type').value
    const ingame_only = document.getElementById('ingame_only').value
    const parent_community_id = document.getElementById('parent_community_id').value

    var icon_dom = document.getElementById("icon")
    var banner_ctr_dom = document.getElementById("banner-ctr")
    var banner_wup_dom = document.getElementById("banner-wup")

    var icon
    var banner_ctr
    var banner_wup

    if (icon_dom.files[0]) {
        icon = (await readUploadedFile(icon_dom.files[0])).slice(23, Infinity)
    }

    if (banner_ctr_dom.files[0]) {
        banner_ctr = (await readUploadedFile(banner_ctr_dom.files[0])).slice(23, Infinity)
    }

    if (banner_wup_dom.files[0]) {
        banner_wup = (await readUploadedFile(banner_wup_dom.files[0])).slice(23, Infinity)
    }

    const body = {
        name: name,
        desc: desc,
        title_ids: title_ids,
        pid: pid,
        app_data: app_data,
        platform: platform,
        post_type: post_type,
        type: type,
        parent_community_id: parent_community_id,
        ingame_only: ingame_only,
        icon: icon,
        banner_ctr: banner_ctr,
        banner_wup: banner_wup
    }

    console.log(body)
    showLoading(true);

    fetch("/api/communities/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 201) {
            showLoading(false);
            var resp = await res.json()
            pjax.loadUrl("/communities")
        } else {
            showLoading(false);
            console.log(`Status recieved ${res.status}`)
        }
    })
}

function deleteCommunity(id) {
    showLoading(true);
    fetch(`/api/communities/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async res => {
        if (res.status === 200) {
            showLoading(false);
            var resp = await res.json()
            await pjax.loadUrl("/communities")
        } else {
            showLoading(false);
            console.log(`Status recieved ${res.status}`)
        }
    })
}

async function submitNewAccount() {
    const pid = document.getElementById('pid').value
    const nnid = document.getElementById('nnid').value
    const mii = document.getElementById('mii').value
    const mii_name = document.getElementById('mii_name').value
    const mii_hash = document.getElementById('mii_hash').value
    const bio = document.getElementById('bio').value
    const admin = document.getElementById('admin').value
    const banned = document.getElementById('banned').value
    const threeds_service_token = document.getElementById('3ds_service_token').value
    const wiiu_service_token = document.getElementById('wiiu_service_token').value
    const game_experience = document.getElementById('game_experience').value
    const language = document.getElementById('language').value
    const country = document.getElementById('country').value
    const favorite_post = document.getElementById('favorite_post').value
    const relationship_visible = document.getElementById('relationship_visible').value
    const allow_friend = document.getElementById('allow_friend').value
    const empathy_notification = document.getElementById('empathy_notification').value
    const community_settings = document.getElementById('community_settings').value
    const pronouns = document.getElementById('pronouns').value
    const tester = document.getElementById('tester').value

    const body = {
        pid: pid,
        nnid: nnid,
        mii: mii,
        mii_name: mii_name,
        mii_hash: mii_hash,
        bio: bio,
        admin: admin,
        banned: banned,
        threeds_service_token: threeds_service_token,
        wiiu_service_token: wiiu_service_token,
        game_experience: game_experience,
        language: language,
        country: country,
        favorite_post: favorite_post,
        relationship_visible: relationship_visible,
        allow_friend: allow_friend,
        empathy_notification: empathy_notification,
        community_settings: community_settings,
        pronouns: pronouns,
        tester: tester
    }

    console.log(body)
    showLoading(true);
    fetch("/api/accounts/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 201) {
            showLoading(false);
            var resp = await res.json()
            await pjax.loadUrl("/accounts")
        } else {
            showLoading(false);
            console.log(`Status recieved ${res.status}`)
        }
    })
}

async function submitEditedAccount() {
    const pid = document.getElementById('pid').value
    const nnid = document.getElementById('nnid').value
    const mii = document.getElementById('mii').value
    const mii_name = document.getElementById('mii_name').value
    const mii_hash = document.getElementById('mii_hash').value
    const bio = document.getElementById('bio').value
    const admin = document.getElementById('admin').value
    const banned = document.getElementById('banned').value
    const threeds_service_token = document.getElementById('3ds_service_token').value
    const wiiu_service_token = document.getElementById('wiiu_service_token').value
    const game_experience = document.getElementById('game_experience').value
    const language = document.getElementById('language').value
    const country = document.getElementById('country').value
    const favorite_post = document.getElementById('favorite_post').value
    const relationship_visible = document.getElementById('relationship_visible').value
    const allow_friend = document.getElementById('allow_friend').value
    const empathy_notification = document.getElementById('empathy_notification').value
    const community_settings = document.getElementById('community_settings').value
    const pronouns = document.getElementById('pronouns').value
    const tester = document.getElementById('tester').value

    const body = {
        pid: pid,
        nnid: nnid,
        mii: mii,
        mii_name: mii_name,
        mii_hash: mii_hash,
        bio: bio,
        admin: admin,
        banned: banned,
        threeds_service_token: threeds_service_token,
        wiiu_service_token: wiiu_service_token,
        game_experience: game_experience,
        language: language,
        country: country,
        favorite_post: favorite_post,
        relationship_visible: relationship_visible,
        allow_friend: allow_friend,
        empathy_notification: empathy_notification,
        community_settings: community_settings,
        pronouns: pronouns,
        tester: tester
    }
    showLoading(true);
    fetch(`/api/accounts/${document.querySelector(".wrapper").getAttribute("data-account-id")}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 200) {
            showLoading(false);
            var resp = await res.json()
            await pjax.loadUrl("/accounts")
        } else {
            showLoading(false);
            console.log(`Status recieved ${res.status}`)
        }
    })
}

function deleteAccount(id) {
    showLoading(true);
    fetch(`/accounts/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async res => {
        if (res.status === 200) {
            showLoading(false);
            var resp = await res.json()
            await pjax.loadUrl("/accounts")
        } else {
            showLoading(false);
            console.log(`Status recieved ${res.status}`)
        }
    })
}