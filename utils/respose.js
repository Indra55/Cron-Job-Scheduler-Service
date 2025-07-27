function successResponse(res, data, message = "Success") {
  return res.status(200).json({ success: true, message, data });
}

function errorResponse(res, status, error) {
  return res.status(status).json({ success: false, error });
}

module.exports = {
  successResponse,
  errorResponse
};
