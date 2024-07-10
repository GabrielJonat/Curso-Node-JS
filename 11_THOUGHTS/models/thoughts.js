const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Thought = db.define('Thought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

const User = require('./user')

Thought.belongsTo(User)
User.hasMany(Thought
    
)
module.exports = Thought