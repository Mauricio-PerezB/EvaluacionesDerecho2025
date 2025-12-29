"use strict";

export const handleSuccess = (res, statusCode = 200, message, data = null) => {
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
}

export const handleErrorServer = (res, statusCode = 500, message = 'Server error', errorDetails = null) => {
  res.status(statusCode).json({
    message,
    errorDetails,
    status: 'Server error',
  });
};

// Backwards-compatible aliases used across the codebase
export const success = handleSuccess;
export const error = (res, statusCode = 400, message, errorDetails = null) => handleErrorClient(res, statusCode, message, errorDetails);