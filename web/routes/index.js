const express = require('express')
const router = express.Router()

module.exports = client => {
    router.get('/', function (req, res) {
        res.send('Crackhead bot :D')
    })

    return {
        path: '/',
        router
    }
}