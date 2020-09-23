
function redirectLogin(req, res, next){
    if(!req.session.user){
        return res.redirect('users/login')
    }else{
        next()
    }
}

module.exports = {
    redirectLogin
}