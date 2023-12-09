const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            id: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,  // true => createAt, updateAt 컬럼을 자동으로 생성
            underscored: false, // true => 스네이크케이스, false => 카멜케이스
            modelName: 'User',  // 모델 이름 => sequelize 쿼리문에서 사용됨.
            tableName: 'users', // 테이블 이름 => mysql에 생성 되는 테이블 이름, db에 접근할 때 사용.
            paranoid: false,    // true => deleteAt 컬럼을 만듬
            charset: 'utf8mb4', // utf8, mb4는 이모티콘을 넣어야 할때
            collate: 'utf8mb4_general_ci',
        });
    }

    // 관계 설정함. db.User.hasMany(db.Comment) => User : Comment = 1 : N 관계라는 뜻
    // User 객체가(users 테이블이) Comment객체를(comments 테이블을) 다수 갖고 있다.
    static associate(db) {
        // comments 테이블에 foreignKey로 제공할 users 테이블의 sourceKey: id
        db.User.hasMany(db.HealthFood, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
        db.User.hasMany(db.ActivityTracker, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
        db.User.hasOne(db.Profile, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
    }
};