import { auth } from "../lib/auth.js";

export const verifyCookie = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized no session found" });
    }
    req.user = session.user.username || session.user.name;
    req.session = session;
    next();
  } catch (error) {
    console.log("Error in verifyCookie", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
