import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ success: false, msg: 'Unauthorized. Token not provided' });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, msg: 'Unauthorized. Invalid token' });
    }
}

//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 'admin'){
            return res.status(403).json({ success: false, msg: 'Admin resource. Access denied.'});
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, msg: 'Server Error'});    
    }
}
