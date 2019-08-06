const router = require('express').Router();
const controller = require('../controllers/analyze');

router.post('/', controller.analyze);

module.exports = router;
