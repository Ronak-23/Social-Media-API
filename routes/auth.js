const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

const User = require('../models/User')


router.post('/',
    [
        check('email', 'Please provide a valid E-mail').isEmail(),
        check('password', 'Please provide atleast 6 character long password').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }

        const { email, password } = req.body
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ msg: " User don't exist " })
            }
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                return res.status(400).json({ msg: " User don't exist " })
            }
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.SECRET, {
                expiresIn: 3600
            }, (err, token) => {
                if (err) throw err
                res.send({ token })
            })

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    })

module.exports = router
