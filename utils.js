/*
utilities file
(i didn't want to clutter the main app.js)
*/
const {User} = require('./db.js')
let match = async function matchCredentials(requestBody) { 
    let user = await User.findAll({
        where:{
            username: requestBody.username,
            password: requestBody.password
        }
    })
    console.log(user)
    if (user.length > 0) {
        return true
    } else {
        return false
    }
}
module.exports = match