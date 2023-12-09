const Sequelize = require('sequelize');

module.exports = class HealthFood extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            healthFoodId: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            healthFoodName: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,              // true => createAt, updateAt 컬럼을 자동으로 생성
            underscored: false,             // true => 스네이크케이스, false => 카멜케이스
            modelName: 'HealthFood',      // 모델 이름 / sequelize 쿼리문에서 사용됨.
            tableName: 'healthFoods',     // 테이블 이름 / MySQL에 생성 되는 테이블 이름, db에 접근할 때 사용.
            paranoid: false,                // true => deleteAt 컬럼을 만듬
            charset: 'utf8mb4',             // utf8, mb4는 이모티콘을 넣어야 할때
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        // users 테이블에서 어떤 컬럼을 참조할 것인가? => users 테이블의 id를 참조하며, comments 테이블에 userId 컬럼에 저장함.
        db.HealthFood.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
    }
};
