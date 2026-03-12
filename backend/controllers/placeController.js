const { Place, City, Review } = require('../model/models');
const { Sequelize } = require('sequelize');
const socket = require('../socket');

exports.createPlace = async (req, res) => {
    try {
        const { cityName, name, type, description, photo_url, latitude, longitude } = req.body;
        // Найти или создать город
        let city = await City.findOne({ where: { name: cityName } });
        if (!city) {
            city = await City.create({ name: cityName });
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ message: 'Некорректные координаты' });
        }
        const place = await Place.create({
            city_id: city.id,
            name,
            type,
            description,
            photo_url,
            latitude,
            longitude,
            rating: 0
        });
        res.status(201).json(place);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


// Поиск мест по названию города
exports.getPlacesByCity = async (req, res) => {
    try {
        const { cityName } = req.params;
        const city = await City.findOne({ where: { name: cityName } });
        if (!city) return res.status(404).json({ message: 'Город не найден' });

        const places = await Place.findAll({
            where: { city_id: city.id }
            // Убрано всё, что связано с Reviews
        });
        res.json(places);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Возвращает 4 популярных места
exports.getPopularPlaces = async (req, res) => {
    try {
        const places = await Place.findAll({
            order: [['rating', 'DESC']],
            limit: 4,
            include: [City]
        });
        res.json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Случайное место
exports.getRandomPlace = async (req, res) => {
    try {
        const place = await Place.findOne({
            order: Sequelize.literal('RANDOM()'),
            include: [City]
        });
        res.json(place);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Получить место по ID с отзывами
exports.getPlaceById = async (req, res) => {
    try {
        const place = await Place.findByPk(req.params.id, {
            include: [City]
        });
        if (!place) return res.status(404).json({ message: 'Место не найдено' });
        res.json(place);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Добавить отзыв
exports.addReview = async (req, res) => {
    try {
        const { placeId } = req.params;
        const { user_name, rating, comment } = req.body;

        // Создание отзыва
        const review = await Review.create({
            place_id: placeId,
            user_name,
            rating,
            comment
        });

        // Пересчёт среднего рейтинга
        const reviews = await Review.findAll({ where: { place_id: placeId } });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Place.update({ rating: avgRating.toFixed(1) }, { where: { id: placeId } });

        // Получаем обновлённое место с отзывами и городом
        const updatedPlace = await Place.findByPk(placeId, {
            include: [City, Review]
        });

        // Отправляем событие через Socket.IO
        const io = socket.getIO();
        io.emit('reviewAdded', updatedPlace);

        res.status(201).json(review);
    } catch (err) {
        console.error('❌ Ошибка в addReview:', err);
        res.status(500).json({ error: err.message });
    }
};