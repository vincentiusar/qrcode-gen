module.exports = (sequelize, DataTypes) => {
    const Url = sequelize.define(
        "urls",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            key: {
                type: DataTypes.TEXT('long'),
                allowNull: false
            },
            value: {
                type: DataTypes.TEXT('long'),
                allowNull: false
            }
        }, 
        {
            timestamps: true,
        }
    );
    return Url;
};
