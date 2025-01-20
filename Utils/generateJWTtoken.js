import jwt from "jsonwebtoken";

const generateJwt = async (user, role) => {
  try {
    const payload = {
      engineerId: role === "Engineer" ? user._id : user.engineerId,
      supervisorId: role === "Supervisor" ? user._id : null,
      role: role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error.message);
    throw error;
  }
};

export default generateJwt;
