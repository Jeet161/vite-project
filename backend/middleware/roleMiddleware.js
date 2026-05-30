export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(`[restrictTo] required=${roles.join(",")} | user.role=${req.user?.role} | user.id=${req.user?.id}`);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission" });
    }
    next();
  };
};