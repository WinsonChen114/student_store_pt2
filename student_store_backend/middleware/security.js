const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const { UnauthorizedError } = require("../utils/errors")

//Extract JWT from request Header
const jwtFrom = ({ headers }) => {
    console.log(headers)
    if (headers?.authorization) {
        //Authorization: "Bearer tokentext"
        const [scheme, token] = headers.authorization.split(" ")
        if (scheme.trim() === "Bearer") {
            return token
        }
    }

    return null
}

//Attach User to response object
const extractUserFromJwt = (request, response, next) => {
    try {
        const token = jwtFrom(request)
        if (token) {
            response.locals.user = jwt.verify(token, SECRET_KEY)
        }
        return next()
    }
    catch (err) {
        return next()
    }
}

//Verify an authed user exists
const requireAuthenticatedUser = (request, response, next) => {
    try {
        const {user} = response.locals
        if(!user?.email)
        {
            throw new UnauthorizedError()
        }
        return next()
    }
    catch(err)
    {
        return next(err)
    }
}

module.exports = {
    jwtFrom,
    extractUserFromJwt,
    requireAuthenticatedUser
}