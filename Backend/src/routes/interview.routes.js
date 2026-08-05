const express = require('express');

const generateReportController = require('../controllers/interview.controller');
const userAuthMiddleware = require('../middleware/auth.middleware');

const interviewRoute = express.Router();

const upload = require('../middleware/file.middleware')

/**
 * @route POST /api/interview
 * @description Generate new intreview report on basis of user self descripton, resume PDF , job Description
 * @access private
 */

interviewRoute.post('/', userAuthMiddleware,upload.single("resume"), generateReportController)

module.exports = interviewRoute