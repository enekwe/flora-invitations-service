const logger = require('../config/logger');

exports.sendCapitalCallNotice = async (req, res) => {
  res.status(501).json({ success: false, message: 'Capital call email functionality not yet implemented', planned: true });
};

exports.sendDistributionNotice = async (req, res) => {
  res.status(501).json({ success: false, message: 'Distribution notice functionality not yet implemented', planned: true });
};

exports.sendBulkCapitalCalls = async (req, res) => {
  res.status(501).json({ success: false, message: 'Bulk capital calls functionality not yet implemented', planned: true });
};

exports.sendCapitalCallReminder = async (req, res) => {
  res.status(501).json({ success: false, message: 'Capital call reminder functionality not yet implemented', planned: true });
};
