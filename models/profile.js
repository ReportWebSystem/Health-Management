const Sequelize = require('sequelize');

module.exports = class Profile extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            profileId: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            profileInfoDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            height: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            bloodType: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            smoke: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            drink: {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,              // true => createAt, updateAt 컬럼을 자동으로 생성
            underscored: false,             // true => 스네이크케이스, false => 카멜케이스
            modelName: 'Profile',           // 모델 이름 / sequelize 쿼리문에서 사용됨.
            tableName: 'profiles',          // 테이블 이름 / mysql에 생성 되는 테이블 이름, db에 접근할 때 사용.
            paranoid: false,                // true => deleteAt 컬럼을 만듬
            charset: 'utf8mb4',             // utf8, mb4는 이모티콘을 넣어야 할때
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        db.Profile.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
    }
};
