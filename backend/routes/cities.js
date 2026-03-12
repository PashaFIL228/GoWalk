const router = require('express').Router();
const cityController = require('../controllers/cityController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), cityController.createCity);
router.get('/', cityController.getAllCities);

module.exports = router;