import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log("Server: Received token:", token);

        if (!token) {
            console.log("Server: No token provided. Unauthorized.");
            return res.status(401).json({ success: false, msg: 'Unauthorized. Token not provided' });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log("Server: Decoded token:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Server: Error while verifying token:", error);
        return res.status(401).json({ success: false, msg: 'Unauthorized. Invalid token' });
    }
}

// Admin access middleware
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        console.log("Server: User role:", user.role);

        if (user.role !== 'admin') {
            console.log("Server: User does not have admin privileges. Access denied.");
            return res.status(403).json({ success: false, msg: 'Admin resource. Access denied' });
        } else {
            next();
        }
    } catch (error) {
        console.error("Server: Error while checking admin access:", error);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
}
