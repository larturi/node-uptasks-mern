import jwt from "jsonwebtoken";

const generarJWT = (userId) => {
    return jwt.sign({
            userId
        },
        process.env.JWT_SECRET, {
            expiresIn: "30d"
        }
    );
}

export default generarJWT;