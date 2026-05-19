const express = require('express');
const router = express.Router();
const { requestLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorize');

// مسار للموظف لطلب الإجازة
router.post('/request', protect, authorize('admin', 'manager', 'employee'), requestLeave);

// مسار للـ HR فقط للموافقة أو الرفض
router.put('/status/:id', protect, authorize('admin', 'manager'), updateLeaveStatus);

module.exports = router;

