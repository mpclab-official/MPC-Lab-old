const {
    fs,
    router,
} = require('./common.js');

// Favicon.ico
router.get('/favicon.ico', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end(fs.readFileSync('./favicon.ico'), 'binary');
});

module.exports = router;