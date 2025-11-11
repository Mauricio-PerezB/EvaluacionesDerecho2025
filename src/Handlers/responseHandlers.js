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
<<<<<<< Updated upstream
  res.status(statusCode).json({
    message,
    errorDetails,
    status: "Server error",
  });
};
=======

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      message: "Ocurrió un error inesperado en el servidor.",
      errorDetails: null,
      status: "Server error",
    });
  } else {
    res.status(statusCode).json({
      message,
      errorDetails: errorDetails || "No details provided.",
      status: "Server error",
    });
  }
};

// Backwards-compatible aliases used across the codebase
export const success = handleSuccess;
export const error = handleErrorClient;
>>>>>>> Stashed changes
