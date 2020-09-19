/** Inside form area, we can add posts. Like, comments etc. */
const express = require('express');
const router = express.Router();

/** @route  GET api/posts
 *  @desc   Add, Update Users Route
 *  @access Public  */
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
