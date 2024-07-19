module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "users",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [4, 20],
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
        }, 
        {
            timestamps: true,
        }
    );
    return User;
};
