const {
    router,
    languages_list,
} = require('./common.js');

// HOME - No languages
router.get('/', (req, res) => {
    res.redirect(`/${languages_list[0]}`);
});

module.exports = router;