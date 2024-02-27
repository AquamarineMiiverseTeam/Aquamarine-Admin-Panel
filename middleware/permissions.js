const permission = (permission_level) => {
    return (req, res, next) => {
        if ((req.account[0].permission_level != permission_level) && (req.account[0].admin != 1)) {
            res.render("error/error_permission", {
                account : req.account[0]
            })
            return;
        }
        next()
    }
}

module.exports = permission