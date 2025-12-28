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
};

export const handleErrorServer = (res, statusCode = 500, message, errorDetails = null) => {
  console.error("Server Error:", message, errorDetails);
<<<<<<< HEAD
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


export const success = handleSuccess;
export const error = handleErrorClient;
>>>>>>> main
