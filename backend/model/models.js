const sequelize = require('../db');
const { DataTypes } = require('sequelize');


const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
});

// Модель City
const City = sequelize.define('city', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

// Модель Place
const Place = sequelize.define('place', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: {
        type: DataTypes.ENUM('park', 'waterfront', 'viewpoint', 'historic'),
        allowNull: false
    },
    description: { type: DataTypes.TEXT },
    photo_url: { type: DataTypes.STRING },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false }
});

// Модель Review
const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_name: { type: DataTypes.STRING, allowNull: false },
    rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});


City.hasMany(Place, { foreignKey: 'city_id', onDelete: 'CASCADE' });
Place.belongsTo(City, { foreignKey: 'city_id' });

Place.hasMany(Review, { foreignKey: 'place_id', onDelete: 'CASCADE' });
Review.belongsTo(Place, { foreignKey: 'place_id' });


User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    City,
    Place,
    Review
};