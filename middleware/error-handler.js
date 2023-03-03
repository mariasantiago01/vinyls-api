const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try again later.'
    }

    if (err.name === 'ValidatorError') {
        console.log(Object.values(err.errors));
        customError.msg = Object.values(err.errors).map((item) => item.message.join(' '))
        customError.statusCode = 400
    }

    if (err.code && err.code === 11000) {
        customError.msg = `The ${Object.keys(err.keyValue)} already exists. Please enter a different ${Object.keys(err.keyValue)}.`
        customError.statusCode = 400
    }

    if(err.name === "CastError") {
        customError.msg = `There was no item found with id: ${err.value}.`
        customError.statusCode = 404
    }
    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware