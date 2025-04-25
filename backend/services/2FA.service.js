import otplib from "otplib";
import qrcode from "qrcode";

const secret = otplib.authenticator.generateSecret();

const generateQR = async (secret) => {
  const uri = otplib.authenticator.keyuri("ShadowTracker", "Tracker", secret);
  console.log("secret : ", secret);
  console.log("qrCode : ", await qrcode.toDataURL(uri));
};

export const verifyToken = (secret, token) => {
  return otplib.authenticator.check(token, secret);
};

export const generateToken = (secret) => {
  return otplib.authenticator.generate(secret);
};
