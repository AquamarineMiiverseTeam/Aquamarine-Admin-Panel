async function search_communities_by_name(input) {
    const tr = document.querySelectorAll("tbody tr");
    const reg = new RegExp(input.toLowerCase())

    tr.forEach((e) => {
        if (reg.test(String(e.children[6].innerText).toLowerCase())) {
            e.style.display = "table-row"
        } else {
            e.style.display = "none"
        }
    })
}