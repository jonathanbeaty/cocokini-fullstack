'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/cocokini';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-cocokini';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = 'jrb2019matapalo'