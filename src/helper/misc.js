module.exports = {
  response: (res, status, error, message, data, redisNeeded) => {
    let resultPrint = {};
    resultPrint.status = status || 200;
    resultPrint.error = error || false;
    resultPrint.message = message || 'Success';
    if (data) {
      resultPrint.data = data;
    }
    return res.status(resultPrint.status).json(resultPrint);
  },
};
