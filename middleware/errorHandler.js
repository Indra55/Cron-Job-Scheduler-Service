const { errorResponse } = require("../utils/respose");

function errorHandler(err, req, res, next) {
    console.error(err);
    errorResponse(res, 500, err.message || 'Internal Server Error');
}

module.exports = errorHandler;