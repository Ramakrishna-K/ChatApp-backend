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



import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Auth error" });
  }
};

export default protectRoute;


