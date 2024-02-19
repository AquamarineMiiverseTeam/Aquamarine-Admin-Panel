async function show_entries(number) {
    const tr = document.querySelectorAll("tr");
    number = Number(number) + 1

    for (let i = 0; i < tr.length; i++) {
        tr[i].style.display = "none"
    }
    for (let i = 0; i < number; i++) {
        tr[i].style.display = "table-row"
    }
}