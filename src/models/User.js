

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     // 🔐 AUTH FIELDS
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     // 🧑‍💼 PROFILE / ONBOARDING FIELDS
//     bio: {
//       type: String,
//       default: "",
//     },

//     gender: {
//       type: String,
//       enum: ["male", "female"],
//     },

//     nativeLanguage: {
//       type: String,
//       default: "",
//     },

//     learningLanguage: {
//       type: String,
//       default: "",
//     },

//     location: {
//       type: String,
//       default: "",
//     },

//     // ✅ PROFILE PIC (base64 OR Cloudinary URL)
//     profilePic: {
//       type: String,
//       default: "",
//     },

//     isOnboarded: {
//       type: Boolean,
//       default: false,
//     },

//     // 👥 FRIENDS
//     friends: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// /// 🔐 HASH PASSWORD BEFORE SAVE
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// /// 🔑 PASSWORD MATCH METHOD
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);

// export default User;


import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // 🔐 AUTH FIELDS
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // 🧑‍💼 PROFILE / ONBOARDING FIELDS
    bio: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    nativeLanguage: {
      type: String,
      default: "",
    },

    learningLanguage: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // ✅ PROFILE PIC (base64 OR Cloudinary URL)
    profilePic: {
      type: String,
      default: "",
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },

    // 👥 FRIENDS
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/// 🔐 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/// 🔑 PASSWORD MATCH METHOD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;







