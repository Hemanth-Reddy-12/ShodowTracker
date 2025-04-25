import { verifyToken } from "../services/2FA.service.js";
import { generateTokenAndSetCookie } from "../config/generateTokenAndSetCookie.js";

export const verify2FA = (req, res) => {
  const token = req.body.token;
  const { username, id, email } = {
    username: process.env.USER,
    id: process.env.ID,
    email: process.env.EMAIL,
  };
  if (!token) {
    res.status(400).send({ status: false, msg: "Enter the Token" });
  }
  try {
    const isValid = verifyToken(process.env.SECRET_2FA, token);
    if (isValid) {
      generateTokenAndSetCookie(res, process.env.USER);
      res.status(200).send({
        status: true,
        msg: "2FA Verified",
        username,
        id,
        email,
      });
    } else {
      res.status(404).send({
        status: false,
        msg: "2FA Not Verified",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Internal Server Error" });
  }
};

export const getF2ADetails = (req, res) => {
  try {
    const qrCode = process.env.QRCODE_2FA;
    res.status(200).send({ status: true, qrCode });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    if (req.user === process.env.USER) {
      return res.status(200).json({
        success: true,
        message: "User is authenticated",
        user: process.env.USER,
        id: process.env.ID,
        email: process.env.EMAIL,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "user not authenticated",
      });
    }
  } catch (error) {
    console.log("Error is verifyToken ", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
