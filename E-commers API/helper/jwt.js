const { expressjwt: jwt } = require('express-jwt')

module.exports.authJwt = () => {
    const secret = process.env.SECRET;
    const api = process.env.API_URI;
    console.log("middleware calling")
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/user/login`,
            `${api}/user/register`
        ]
    })
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        console.log(token.payload.isAdmin)
        return true
    }
    console.log(token.payload.isAdmin)

}