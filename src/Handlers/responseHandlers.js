"use strict";

export const handleSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    message,
    data,
    status: "Success",
  });
};

export const handleErrorClient = (res, statusCode, message, errorDetails = null) => {
  res.status(statusCode).json({
    message,
    errorDetails,
    status: "Client error",
  });
};

export const handleErrorServer = (res, statusCode, message, errorDetails = null) => {
  console.error("Server Error:", message, errorDetails);
  return res.status(statusCode || 500).json({
    message: message || 'Server error',
    errorDetails,
    status: 'Server error',
  });
};
;

// Backwards-compatible aliases (some controllers used `success`/`error`)
export const success = handleSuccess;
export const error = (res, statusCode, message, errorDetails = null) => {
  if (statusCode >= 500) return handleErrorServer(res, statusCode, message, errorDetails);
  return handleErrorClient(res, statusCode, message, errorDetails);
};