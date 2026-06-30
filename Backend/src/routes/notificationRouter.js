const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
    getUserNotifications,
    markNotificationAsRead,
} = require('../controllers/notification.controller');

router.get('/', authMiddleware.authUser, getUserNotifications);
router.put('/:id/read', authMiddleware.authUser, markNotificationAsRead);

module.exports = router;
