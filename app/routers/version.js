const router = require('express').Router();
const controller = require('../controllers/version');

router.get('/', controller.version);

module.exports = router;
