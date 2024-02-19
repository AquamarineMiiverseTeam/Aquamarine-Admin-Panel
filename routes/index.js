module.exports = [
    {
        path : "/accounts/",
        route : require("./ui/account")
    },

    {
        path : "/communities/",
        route : require("./ui/communities")
    },

    {
        path : "/analytics/",
        route : require("./ui/analytics")
    },

    {
        path : "/api/",
        route : require("./api.js")
    },

    {
        path : "/empathies/",
        route : require("./ui/empathies.js")
    },

    {
        path : "/favorites/",
        route : require("./ui/favorites.js")
    },

    {
        path : "/admin/",
        route : require("./ui/admin.js")
    },

    {
        path : "/",
        route : require("./ui/root")
    }
]