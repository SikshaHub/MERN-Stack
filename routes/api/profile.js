/** Handle routes that have anything to do with Profile- fetching, updating, adding them */
const express = require('express');
const router = express.Router();

/** @route  GET api/profile
 *  @desc   Add, Update Users Route
 *  @access Public  */
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
