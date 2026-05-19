const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorize');

router.post('/checkin', protect, authorize('admin', 'manager', 'employee'), checkIn);
router.put('/checkout', protect, authorize('admin', 'manager', 'employee'), checkOut);
router.get('/my-history', protect, authorize('admin', 'manager', 'employee'), getMyAttendance);


module.exports = router;