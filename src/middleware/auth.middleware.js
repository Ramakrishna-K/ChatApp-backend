// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized - No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized - Invalid token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized - User not found" });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const auth = async (req, res, next) => {
//   try {
//     // 1. Get token from cookies
//     const token = req.cookies?.jwt;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - No token provided" });
//     }

//     // 2. Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     if (!decoded) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - Invalid token" });
//     }

//     // 3. Find user
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - User not found" });
//     }

//     // 4. Attach user to request
//     req.user = user;

//     // 5. Continue
//     next();
//   } catch (error) {
//     console.error("Error in auth middleware:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export default auth;



// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies?.jwt;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized - No token" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized - User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(500).json({ message: "Auth error" });
//   }
// };

// export default protectRoute;

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes
 * Supports:
 *   1. JWT in cookies (req.cookies.jwt)
 *   2. JWT in Authorization header (Bearer token)
 */
const protectRoute = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header first
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ If no header, check cookie
    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch user from DB and remove password
    const user = await User.findById(decoded.userId || decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    res.status(500).json({ message: "Auth error" });
  }
};

export default protectRoute;

