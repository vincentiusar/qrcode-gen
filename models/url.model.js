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
                type: DataTypes.STRING,
                allowNull: false
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, 
        {
            timestamps: true,
        }
    );
    return Url;
};
