const express = require('express')
const router = express.Router()

// @desc Login/Landing page
// @route GET /

router.get('/', (req, res) => {
    res.render('Login', {
        layout: "login"
    })
})

// @desc Dashboard
// @route GET /Dashboard
router.get('/dashboard', (req,res) => {
    res.render('Dashboard')
})

module.exports = router