const notFound = async(req, res, next) => {
  // Fallback for error 404 of invalid routes like /api/asdf
  // By default it returns HTML with 'Cannot GET /api/asdf'
  // But using this middleware it will return a nice JSON
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = async(err, req, res, next) => {
  // Set the status code and return a nicely formatted error message object
  const statusCode = res.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export { notFound, errorHandler };