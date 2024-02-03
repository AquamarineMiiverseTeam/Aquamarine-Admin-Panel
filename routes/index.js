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
        path : "/audit/",
        route : require("./ui/audit")
    },

    {
        path : "/api",
        route : require("./api")
    },

    {
        path : "/",
        route : require("./ui/root")
    }
]