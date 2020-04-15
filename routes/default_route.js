const express = require('express');

const router = express.Router();

const controller = require('../controller/default');

router.post('/', controller.estimateJson);
router.post('/json', controller.estimateJson);
router.post('/xml', controller.estimateXML);
router.post('/logs', controller.getLog);
router.get('/logs', controller.getLog);
module.exports = router;
