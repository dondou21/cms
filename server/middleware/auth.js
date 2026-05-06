/**
 * Auth middleware — BYPASSED for full local/offline access.
 * Both protect and authorize are passthrough no-ops.
 * Restore real logic here when auth is needed for production.
 */

exports.protect = (req, res, next) => {
    // Bypass: attach a default user so any downstream code that
    // reads req.user doesn't crash.
    req.user = { id: 1, name: 'Admin', role: 'Admin' };
    next();
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Bypass: always allow.
        next();
    };
};
