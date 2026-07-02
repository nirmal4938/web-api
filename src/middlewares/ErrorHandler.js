// ============================================================
// Global Error Handler
// ============================================================
//
// Responsibilities
//
// • Log unexpected errors
// • Return standardized API responses
// • Preserve application error status codes
// • Hide stack traces outside development
//
// ============================================================

export default function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

  const statusCode = err.statusCode || err.status || 500;

  const code = err.code || "INTERNAL_SERVER_ERROR";

  const message = err.message || "Something went wrong.";

  return res.status(statusCode).json({
    success: false,

    code,

    message,

    timestamp: new Date().toISOString(),

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
}
