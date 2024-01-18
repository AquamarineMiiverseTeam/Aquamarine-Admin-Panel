var pjax = new Pjax({
    selectors: ["body"]
})

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

function moderatePost(id) {
    console.log(id)

    fetch(`/posts/${id}/moderate`, {
        method: "POST"
    }).then(res => {
        if (res.status === 200) {
            pjax.loadUrl(window.location.pathname)
        } else {
            console.log(`Status recieved ${res.status}`)
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
        name : name,
        desc : desc,
        title_ids : title_ids,
        pid : pid,
        app_data : app_data,
        platform : platform,
        post_type : post_type,
        type : type,
        parent_community_id : parent_community_id,
        ingame_only : ingame_only,
        special_community : special_community,
        icon : icon,
        banner_ctr : banner_ctr,
        banner_wup : banner_wup
    }

    console.log(body)

    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        if (res.status === 200) {
            pjax.loadUrl("/communities")
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
        name : name,
        desc : desc,
        title_ids : title_ids,
        pid : pid,
        app_data : app_data,
        platform : platform,
        post_type : post_type,
        type : type,
        parent_community_id : parent_community_id,
        ingame_only : ingame_only,
        icon : icon,
        banner_ctr : banner_ctr,
        banner_wup : banner_wup
    }

    console.log(body)

    fetch(window.location.pathname, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        if (res.status === 201) {
            pjax.loadUrl("/communities")
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
    }).then(res => {
        if (res.status === 200) {
            pjax.loadUrl("/communities")
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
    
    const body = {
        pid : pid,
        nnid : nnid,
        mii : mii,
        mii_name : mii_name,
        mii_hash : mii_hash,
        bio : bio,
        admin : admin,
        banned : banned,
        threeds_service_token : threeds_service_token,
        wiiu_service_token : wiiu_service_token,
        game_experience : game_experience,
        language : language,
        country : country
    }

    console.log(body)

    fetch(window.location.pathname, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        if (res.status === 201) {
            pjax.loadUrl("/accounts")
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
    
    const body = {
        pid : pid,
        nnid : nnid,
        mii : mii,
        mii_name : mii_name,
        mii_hash : mii_hash,
        bio : bio,
        admin : admin,
        banned : banned,
        threeds_service_token : threeds_service_token,
        wiiu_service_token : wiiu_service_token,
        game_experience : game_experience,
        language : language,
        country : country
    }

    console.log(body)

    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        if (res.status === 200) {
            pjax.loadUrl("/accounts")
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
    }).then(res => {
        if (res.status === 200) {
            pjax.loadUrl("/accounts")
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