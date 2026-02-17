

// import { upsertStreamUser } from "../lib/stream.js";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// /* =========================
//    SIGNUP
// ========================= */
// export async function signup(req, res) {
//   const { email, password, fullName } = req.body;

//   try {
//     if (!email || !password || !fullName) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const idx = Math.floor(Math.random() * 100) + 1;
//     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

//     const newUser = await User.create({
//       email,
//       fullName,
//       password,
//       profilePic: randomAvatar,
//       isOnboarded: false,
//     });

//     await upsertStreamUser({
//       id: newUser._id.toString(),
//       name: newUser.fullName,
//       image: newUser.profilePic,
//     });

//     const token = jwt.sign(
//       { userId: newUser._id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     res.cookie("jwt", token, {
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(201).json({ success: true, user: newUser });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// /* =========================
//    LOGIN
// ========================= */
// export async function login(req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid email or password" });

//     const isPasswordCorrect = await user.matchPassword(password);
//     if (!isPasswordCorrect)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     res.cookie("jwt", token, {
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// /* =========================
//    LOGOUT
// ========================= */
// export function logout(req, res) {
//   res.clearCookie("jwt");
//   res.status(200).json({ success: true, message: "Logout successful" });
// }

// /* =========================
//    ONBOARDING (MERGED + IMAGE)
// ========================= */
// export async function onboard(req, res) {
//   try {
//     const userId = req.user._id;

//     const {
//       fullName,
//       bio,
//       gender,
//       nativeLanguage,
//       learningLanguage,
//       location,
//     } = req.body;

//     if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     // ✅ profile pic logic (same as your SQL version)
//     const profilePic = req.file
//       ? `/uploads/${req.file.filename}`
//       : req.user.profilePic;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         fullName,
//         bio,
//         gender,
//         nativeLanguage,
//         learningLanguage,
//         location,
//         profilePic,
//         isOnboarded: true,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ✅ update Stream user
//     await upsertStreamUser({
//       id: updatedUser._id.toString(),
//       name: updatedUser.fullName,
//       image: updatedUser.profilePic || "",
//     });

//     res.status(200).json({ success: true, user: updatedUser });

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

/* =========================
   SIGNUP
========================= */
export const signup = async (req, res) => {
  try {
    const { name, fullName, email, password } = req.body;

    // Validate required fields
    if (!email || !password || !(name || fullName)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Random avatar
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // Create user
    const newUser = await User.create({
      name: name || fullName,
      fullName: fullName || name,
      email,
      password: hashedPassword,
      profilePic: randomAvatar,
      isOnboarded: false,
    });

    // Stream integration
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName || newUser.name,
      image: newUser.profilePic,
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
};

/* =========================
   GET CURRENT USER
========================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   ONBOARDING
========================= */
export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, gender, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Profile pic logic
    const profilePic = req.file ? `/uploads/${req.file.filename}` : req.user.profilePic;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, gender, nativeLanguage, learningLanguage, location, profilePic, isOnboarded: true },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // Update Stream user
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Onboarding failed" });
  }
};













//   } catch (error) {
//     console.error("Onboarding error:", error);
//     res.status(500).json({ message: "Onboarding failed" });
//   }
// }
