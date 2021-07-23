module.exports = function(sequelize, DataTypes) {
    //allowNull 컬럼의 값이 없어도 되는지 여부 (default는 true)
    const product = sequelize.define('Products',{
        name : {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        imageUrl : {
            type:DataTypes.STRING(300),
            allowNull: true
        },
        description : {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        seller: {
             type: DataTypes.STRING(30),
            allowNull: false
        }
    });
    return product;
}