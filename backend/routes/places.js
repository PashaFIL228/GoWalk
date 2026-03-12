const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, checkRole(['ADMIN']), placeController.createPlace);
router.get('/popular', placeController.getPopularPlaces);
router.get('/city/:cityName', placeController.getPlacesByCity);
router.get('/random', placeController.getRandomPlace);
router.get('/:id', placeController.getPlaceById);
router.post('/:placeId/reviews', placeController.addReview);

module.exports = router;