async function init_data() {
    let data = JSON.parse(document.querySelector("canvas[data-table-data]").getAttribute("data-table-data"))
    let notifications_data = JSON.parse(document.querySelector("canvas[data-table-data]").getAttribute("data-table-notifications-data"))

    let chart_data = [];
    let labels = [];

    data.forEach((e) => {
        labels.push(new Date(e.forDate).toLocaleDateString())
    })

    data.forEach((e) => {
        chart_data.push({x : new Date(e.forDate).toLocaleDateString(), y : e.numAPICalls})
    })

    let chart_data_notifications = [];
    let labels_notifications = [];

    notifications_data.forEach((e) => {
        labels_notifications.push(new Date(e.forDate).toLocaleDateString())
    })

    notifications_data.forEach((e) => {
        chart_data_notifications.push({x : new Date(e.forDate).toLocaleDateString(), y : e.numAPICalls})
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
            },
            {
                label : "Notifications",
                data : chart_data_notifications,
                borderColor : "pink",
                fill: false,
                tension: 0
            }
        ]
        },
        options: {}
    })


}