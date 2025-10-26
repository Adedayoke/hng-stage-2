// Error handler middleware
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message
    });
};

// 404 handler
exports.notFound = (req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
};

// Request logger
exports.logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};
