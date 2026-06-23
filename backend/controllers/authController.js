const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
    try {
        const { name, email, password, jobRole, basicSalary, annualLeaveBalance, role } = req.body;

        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = await Employee.create({
            name,
            email,
            password: hashedPassword,
            jobRole,
            basicSalary,
            annualLeaveBalance,
            role
        });

        res.status(201).json({
            message: 'Employee created successfully',
            employee: { id: employee._id, name: employee.name, email: employee.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                role: employee.role,
                jobRole: employee.jobRole
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const employee = await Employee.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, employee.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        employee.password = await bcrypt.hash(newPassword, 10);
        await employee.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMe = async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.id).select('-password');
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
