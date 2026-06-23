const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
exports.requestLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const employee = await Employee.findById(req.user.id);
        if (employee.annualLeaveBalance < diffDays) {
            return res.status(400).json({ message: 'Insufficient leave balance' });
        }

        const leave = await Leave.create({
            employee: req.user.id,
            leaveType,
            startDate,
            endDate,
            reason
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('dashboardUpdate', { type: 'leave', action: 'request', data: leave });
        }

        res.status(201).json({ message: 'Leave request submitted', leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const leave = await Leave.findById(req.params.id);

        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        if (status === 'Approved') {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
            await Employee.findByIdAndUpdate(leave.employee, {
                $inc: { annualLeaveBalance: -diffDays }
            });
        }

        leave.status = status;
        leave.approvedBy = req.user.id;
        await leave.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('dashboardUpdate', { type: 'leave', action: 'status_update', data: leave });
        }

        res.json({ message: `Leave ${status}`, leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};