import jwt from "jsonwebtoken";
import Supervisors from "../Models/Supervisors.model.js"
import Engineers from "../Models/Engineers.model.js"

const generateJwt = async (userId) => {
    try {
        let user, payload;

        user = await Supervisors.findById(userId);
        if (user) {
            payload = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: "supervisor",
                scope: user.role,
                address: user.address,
                phoneNo: user.phoneNo,
                assignedEngineer: user.engineerId,
            };
        } else {

            user = await Engineers.findById(userId);
            if (user) {
                payload = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: "engineer",
                    companyName: user.companyName,
                    companyLogo: user.companyLogo,
                    companyDesc: user.companyDesc,
                    address: user.address,
                    phoneNo: user.phoneNo,
                };
            }
        }

        if (!user) throw new Error("User not found");

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
