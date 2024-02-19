async function init_data() {
    let data = JSON.parse(document.querySelector("canvas[data-table-data]").getAttribute("data-table-data"))

    let chart_data = [];
    let labels = [];

    data.forEach((e) => {
        labels.push(new Date(e.forDate).toLocaleDateString())
    })

    data.forEach((e) => {
        chart_data.push({x : new Date(e.forDate).toLocaleDateString(), y : e.numAPICalls})
    })

    const chart = new Chart("api_usage_chart", {
        type: "line",
        data: {
            labels : labels,
            datasets : [{
                label : "Number Of API Calls",
                data : chart_data,
                borderColor : "blue",
                fill: false,
                tension: 0
            }]
        },
        options: {}
    })


}