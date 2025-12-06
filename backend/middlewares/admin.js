const admin = (req, res, next) => {
  if (req.user && req.user.is_admin === 1) {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};

export { admin };
