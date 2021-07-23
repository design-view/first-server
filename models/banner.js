module.exports = function (sequelize, dataTypes) {
    //테이블 이름은 Banner로 생성
    const banner = sequelize.define('Banner', {
        imageUrl: {
            type: dataTypes.STRING(300),
            allowNull: false
        },
        href: {
            type: dataTypes.STRING(200),
            allowNull: false
        }
    });
    return banner;
}