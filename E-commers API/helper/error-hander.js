module.exports.errorHandler = (err, req, res, next) => {

    // Error for unaithrised
    if (err.name == 'UnauthorizedError') {
        return res.status(500).json({ message: "The user is not authorised " })
    }

    // validation error
    if (err.name == 'ValidationError') {
        return res.status(401).json({ message: err })
    }

    // default error
    return res.status(500).json({ err: err.message })
}