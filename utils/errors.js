class MyError extends Error {}

const globalErrorHandler = (err, req, res, next) => {
    console.log(err)
    res
        .status(err instanceof MyError ? 400 : 500)
        .json({
            message: err instanceof MyError ? err.message : 'Sorry, something get wrong.'
        })
}

module.exports = {
    MyError,
    globalErrorHandler
}