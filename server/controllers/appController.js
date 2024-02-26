import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";

/** middleware to verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    // check the user existence
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find user" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;
    console.log(username, password, profile, email, "body");

    // check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username })
        .then((user) => {
          console.log(user);
          if (user) {
            reject(new Error("Please use a unique username"));
          } else {
            resolve();
          }
        })
        .catch((error) => {
          reject(new Error(error));
        });
    });

    // check for existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email })
        .then((existingEmail) => {
          if (existingEmail) {
            reject(new Error("Please use a unique email"));
          } else {
            resolve();
          }
        })
        .catch((error) => {
          reject(new Error(error));
        });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
              profile: profile || "",
              email,
            });
            user
              .save()
              .then((result) =>
                res.status(201).send({
                  msg: "User registered successfully",
                })
              )
              .catch((error) =>
                res.status(500).send({ error: "Error saving user" })
              );
          })
          .catch((error) => {
            return res.status(500).send({
              error: "Unable to hash password",
            });
          });
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    // Handle any synchronous errors
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ msg: "Invalid password" });
            // create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
              msg: "Login Successfully...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Don't have password" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function getUser(req, res) {
  try {
    const { username } = req.params;
    console.log(username, "username..........");

    if (!username) {
      return res.status(400).send({ error: "Invalid Username" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(200).send({ rest });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateUser(req, res) {
  try {
    const id = req.query.id;

    if (id) {
      const body = req.body;
      UserModel.updateOne({ _id: id },body)
      .then((data)=>{
        
        return res.status(201).send({ msg: "User updated successfully" });
      }).catch((error)=>{
        return res.status(500).send({ error });
      })
    } else {
      return res.status(401).send({ error: "User not found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

export async function verifyOTP(req, res) {
  res.json("verifyOTP route");
}

export async function createResetSession(req, res) {
  res.json("verify OTP route");
}

export async function resetPassword(req, res) {
  res.json("resetPassword route");
}
