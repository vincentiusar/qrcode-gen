module.exports = (sequelize, DataTypes) => {
    const Tap = sequelize.define(
        "taps",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        }, 
        {
            timestamps: true,
        }
    );
    return Tap;
};
