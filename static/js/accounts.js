async function search_accounts_by_network_id(input) {
    const tr = document.querySelectorAll("tbody tr");
    const reg = new RegExp(input.toLowerCase())

    tr.forEach((e) => {
        if (reg.test(String(e.children[3].innerText).toLowerCase())) {
            e.style.display = "table-row"
        } else {
            e.style.display = "none"
        }
    })
}