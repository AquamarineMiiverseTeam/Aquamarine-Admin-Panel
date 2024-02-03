var pjax = new Pjax({
    selectors: [".wrapper", ".alerts"]
})

document.addEventListener("pjax:send", () => {
    document.querySelector(".alert-info").style.display = "none";
    document.querySelector(".alert-success").style.display = "none";
})

document.addEventListener("pjax:complete", () => {
    loadPostTimes();
    console.log("pjax complete")
})

function log_in() {
    const password = document.querySelector('input[name="password"]').value
    const network_id = document.querySelector('input[name="network_id"]').value

    document.cookie = `password=${password}`;
    document.cookie = `network_id=${network_id}`;

    pjax.loadUrl("/");
}

function confirmDeletionCommunity(id) {
    if (confirm("Are you sure about deleting this community?") == true) {
        document.querySelector(`button[communityid_delete='${id}']`).style.display = "none"
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
    document.querySelector(`input[type=checkbox][postid="${id}"]`).disabled = true

    fetch(`/api/posts/${id}/moderate`, {
        method: "POST"
    }).then(res => {
        if (res.status === 200) {
            document.querySelector(`input[type=checkbox][postid="${id}"]`).disabled = false
        } else {
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

    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 200) {
            var resp = await res.json()
            console.log("pjax before")
            await pjax.loadUrl("/communities");
            console.log("pjax after")
            console.log(document.querySelector(".alert-info"))
            document.querySelector(".alert-info strong").innerText = resp.header
            document.querySelector(".alert-info span").innerText = resp.message
            document.querySelector(".alert-info").style.display = "block"
        } else {
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

    fetch(window.location.pathname, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 201) {
            var resp = await res.json()
            pjax.loadUrl("/communities")
            document.querySelector(".alert-success strong").innerText = resp.header
            document.querySelector(".alert-success span").innerText = resp.message
            document.querySelector(".alert-success").style.display = "block"
        } else {
            console.log(`Status recieved ${res.status}`)
        }
    })
}

function deleteCommunity(id) {
    fetch(`/communities/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async res => {
        if (res.status === 200) {
            var resp = await res.json()
            await pjax.loadUrl("/communities")
            document.querySelector(".alert-success strong").innerText = resp.header
            document.querySelector(".alert-success span").innerText = resp.message
            document.querySelector(".alert-success").style.display = "block"
        } else {
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

    fetch(window.location.pathname, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 201) {
            var resp = await res.json()
            await pjax.loadUrl("/accounts")
            document.querySelector(".alert-success strong").innerText = resp.header
            document.querySelector(".alert-success span").innerText = resp.message
            document.querySelector(".alert-success").style.display = "block"
        } else {
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

    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status === 200) {
            var resp = await res.json()
            await pjax.loadUrl("/accounts")
            document.querySelector(".alert-success strong").innerText = resp.header
            document.querySelector(".alert-success span").innerText = resp.message
            document.querySelector(".alert-success").style.display = "block"
        } else {
            console.log(`Status recieved ${res.status}`)
        }
    })
}

function deleteAccount(id) {
    fetch(`/accounts/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async res => {
        if (res.status === 200) {
            var resp = await res.json()
            await pjax.loadUrl("/accounts")
            document.querySelector(".alert-success strong").innerText = resp.header
            document.querySelector(".alert-success span").innerText = resp.message
            document.querySelector(".alert-success").style.display = "block"
        } else {
            console.log(`Status recieved ${res.status}`)
        }
    })
}

function loadPostTimes() {
    var table = document.getElementById("admin_table");
    for (var i = 1, row; row = table.rows[i]; i++) { // i is 1 to skip the table header
        var date = new Date(row.cells[0].innerText)
        row.cells[0].innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
}

function sort_account_table(index, id) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById("admin_table");
    tr = table.getElementsByTagName("tr");

    var found = 0;

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[index];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                found += 1;
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    document.getElementById("found").innerText = `Found ${found} Users`;

    if (id == "clear-search-query") {
        document.querySelectorAll("input").forEach((d) => {
            d.value = "";
        })
    }
}

function sort_community_table(index, id) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById("community_table");
    tr = table.getElementsByTagName("tr");

    var found = 0;

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[index];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                found += 1;
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    if (id == "clear-search-query") {
        document.querySelectorAll("input").forEach((d) => {
            d.value = "";
        });
    }

    document.getElementById("found").innerText = `Found ${found} Communities`
}