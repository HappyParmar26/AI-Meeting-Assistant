const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/**
 * @name registerUserController
 * @description Controller to handle user registration, expects username, email, password
 * @access Public
 */

async function registerUserController(req, res) {
    const { username, email, password, admin } = req.body
    

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Please provide username, email and password'
        })
    }

    const existingUser = await User.findOne({
        $or: [{ username: username }, { email }]
    })

    if (existingUser) {
        return res.status(400).json({
            message: 'Account already exists with this email address or username'
        })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({
        username: username,
        email,
        password: hash
    })

    const token = jwt.sign({id: user._id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        
    res.cookie("token", token)
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Controller to handle user login, expects email and password
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: 'Please provide email and password'
        })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid password or email'
        })
    }

    const token = jwt.sign({id: user._id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        
    res.cookie("token", token)

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description clear token from user cookie
 * @access Public
 */

async function logoutUserController(req, res) {
    res.clearCookie('token')

    res.status(200).json({
        message: 'User logged out successfully'
    })
}

/**
 * @name getMeController
 * @description get user details of logged in user
 * @access Private
 */

async function getMeController(req, res) {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    res.status(200).json({
        message: 'User details fetched successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}