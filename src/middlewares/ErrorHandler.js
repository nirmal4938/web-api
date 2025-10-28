export default function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong.';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
