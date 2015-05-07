'use strict';

var express = require('express');
var passport = require('passport');
var custom = require(__dirname+'/auth');

var router = express.Router();

router.get('/', custom.auth);
router.get('/callback', custom.callback);

module.exports = router;
