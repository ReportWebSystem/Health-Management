const Sequelize = require('sequelize');
const User = require('./user');
const ActivityTracker = require('./activityTracker');
const HealthFood = require('./healthFood');
const Profile = require('./profile');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env]; // 설정 로딩
const db = {};

// DB와 연결
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.HealthFood = HealthFood;
db.ActivityTracker = ActivityTracker;
db.Profile = Profile;

// init으로 sequelize와 연결
User.init(sequelize);
HealthFood.init(sequelize);
ActivityTracker.init(sequelize);
Profile.init(sequelize);

// associate로 관계 설정.
User.associate(db);
HealthFood.associate(db);
ActivityTracker.associate(db);
Profile.associate(db);

module.exports = db;


