const AuditLog = require('../models/AuditLog');

// Logs an audit entry for successful JSON responses.
// IMPORTANT: do not call next() until the response method is invoked.
const auditLog = (action, targetModel = null) => (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async (data) => {
    // Only log successful responses
    if (res.statusCode < 400 && req.user) {
      try {
        await AuditLog.create({
          performedBy: req.user.id,
          performedByName: req.user.name || 'Unknown',
          action,
          targetModel,
          targetId: req.params?.id || data?._id || null,
          details: `${action} by user ${req.user.id} on ${targetModel || 'resource'}`,
          ipAddress: req.ip || req.headers['x-forwarded-for'],
        });
      } catch (e) {
        console.error('Audit log error:', e.message);
      }
    }

    return originalJson(data);
  };

  return next();
};

module.exports = auditLog;

