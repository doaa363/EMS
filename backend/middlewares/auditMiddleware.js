const AuditLog = require('../models/AuditLog');
const auditLog = (action, targetModel = null) => (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async (data) => {
    // Only log successful responses
    if (res.statusCode < 400 && req.user) {
      try {
        const currentTime = new Date().toLocaleString('en-US');
        const actionEn = action === 'CREATE' ? 'created' : action === 'UPDATE' ? 'updated' : 'deleted';
        const modelEn = targetModel || 'Record';
        
        await AuditLog.create({
          performedBy: req.user.id,
          performedByName: req.user.name || 'Unknown',
          action,
          targetModel,
          targetId: req.params?.id || data?._id || null,
          details: `Admin [${req.user.name || 'Unknown'}] ${actionEn} [${modelEn}] at [${currentTime}]`,
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
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

