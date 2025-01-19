import EngineersModel from "../Models/Engineers.model.js";
import SupervisorsModel from "../Models/Supervisors.model.js";
import bcrypt from "bcrypt";
import generateJwt from "../Utils/generateJWTtoken.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = {};
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Not all fields have been entered." });
    user = await EngineersModel.findOne({ email: email });
    if (!user) {
      user = await SupervisorsModel.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ message: "No account with this email has been registered." });
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = await generateJwt(
        user,
        user.companyName ? "Engineer" : "Supervisor"
      );
      console.log("Token generated:", token);
      return res.status(200).json({ token, user: user });
    } else {
      return res.status(400).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
