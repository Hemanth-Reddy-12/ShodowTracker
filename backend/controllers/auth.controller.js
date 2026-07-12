export const checkAuth = (req, res) => {
  try {
    if (req.session) {
      return res.status(200).json({
        success: true,
        message: "User is authenticated",
        user: req.session.user.username || req.session.user.name,
        id: req.session.user.id,
        email: req.session.user.email,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "user not authenticated",
      });
    }
  } catch (error) {
    console.log("Error in checkAuth ", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
