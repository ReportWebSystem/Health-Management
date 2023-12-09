/*product => activityTracker*/

const Sequelize = require('sequelize');

module.exports = class ActivityTracker extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            activityId: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            activityInfoDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            activityPlace: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            activityType: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            distance: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            calories: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            runtime: {
                type: Sequelize.TIME,
                allowNull: true
            },
        }, {
            sequelize,
            timestamps: false,       // true => createAt, updateAt 컬럼을 자동으로 생성
            underscored: false,     // true => 스네이크케이스, false => 카멜케이스
            modelName: 'ActivityTracker',   // 모델 이름 / sequelize 쿼리문에서 사용됨.
            tableName: 'activityTrackers',  // 테이블 이름 / mySQL에 생성 되는 테이블 이름, db에 접근할 때 사용.
            paranoid: false,        // true => deleteAt 컬럼을 만듬
            charset: 'utf8mb4',     // utf8, mb4는 이모티콘을 넣어야 할때
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        db.ActivityTracker.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
    }
};