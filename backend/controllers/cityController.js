const { City } = require('../model/models');

exports.createCity = async (req, res) => {
    try {
        const { name } = req.body;
        const city = await City.create({ name });
        res.status(201).json(city);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.findAll();
        res.json(cities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};