const {Sequelize, Model, DataTypes} = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

class User extends Model{}
User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
}, {sequelize, modelName: 'user'})
User.sync({force: true})
console.log('The table for user model was just (re)created')
async ()=>{
    await sequelize.sync()
}

let  models = {
    User: User,
    sessions: {}
}
module.exports = models