import Supervisors from "../Models/Supervisors.model.js";
import Sites from "../Models/Sites.model.js";
import XLSX from "xlsx";

export const createSupervisor = async (req, res) => {
    try {
        const { name, email, address, phoneNo, password, role, engineerId } = req.body;
        const { siteId } = req.query;  

        
        const supervisorExists = await Supervisors.findOne({ email });
        if (supervisorExists) {
            return res.status(400).json({ message: "Supervisor with this email already exists" });
        }

        
        const newSupervisor = new Supervisors({ name, email, address, phoneNo, password, role, engineerId });
        await newSupervisor.save();

        if (siteId) {
            const site = await Sites.findById(siteId);
            if (!site) {
                return res.status(404).json({ message: "Site not found" });
            }

            site.supervisorsId.push(newSupervisor._id);
            await site.save();
        }

        res.status(201).json({ message: "Supervisor created successfully", supervisor: newSupervisor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSupervisor = async (req, res) => {
    try {
        const { supervisorId } = req.params;
        const updatedData = req.body;
        const { siteId } = req.query;  

        const updatedSupervisor = await Supervisors.findByIdAndUpdate(supervisorId, updatedData, { new: true });
        if (!updatedSupervisor) {
            return res.status(404).json({ message: "Supervisor not found" });
        }

        if (siteId) {
            const site = await Sites.findById(siteId);
            if (!site) {
                return res.status(404).json({ message: "Site not found" });
            }

            if (!site.supervisorsId.includes(updatedSupervisor._id)) {
                site.supervisorsId.push(updatedSupervisor._id);
                await site.save();
            }
        }

        res.status(200).json({ message: "Supervisor updated successfully", supervisor: updatedSupervisor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getSupervisorsBySite = async (req, res) => {
    try {
        const { siteId } = req.params;

        const site = await Sites.findById(siteId).populate("supervisorsId");
        
        if (!site) {
            return res.status(404).json({ message: "Site not found" });
        }

        if (site.supervisorsId.length === 0) {
            return res.status(404).json({ message: "No supervisors assigned to this site" });
        }

        res.status(200).json(site.supervisorsId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSupervisorById = async (req, res) => {
    try {
        const { supervisorId } = req.params;
        const supervisor = await Supervisors.findById(supervisorId).populate("engineerId", "name");

        if (!supervisor) {
            return res.status(404).json({ message: "Supervisor not found" });
        }

        res.status(200).json(supervisor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadExcel = async (req, res) => {
    try {
        const { engineerId } = req.query;  
        const { siteId } = req.query;  

        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.file;
        const workbook = XLSX.read(file.data, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const supervisors = [];
        jsonData.forEach((row) => {
            const { name, email, address, phoneNo, password, role } = row;
            if (name && email && address && phoneNo && password && role) {
                supervisors.push({ name, email, address, phoneNo, password, role, engineerId });
            }
        });

        if (supervisors.length === 0) {
            return res.status(400).json({ error: "No valid data found in the file" });
        }

        
        const savedSupervisors = await Supervisors.insertMany(supervisors);

        
        if (siteId) {
            const site = await Sites.findById(siteId);
            if (!site) {
                return res.status(404).json({ message: "Site not found" });
            }


            savedSupervisors.forEach((supervisor) => {
                if (!site.supervisorsId.includes(supervisor._id)) {
                    site.supervisorsId.push(supervisor._id);
                }
            });

            await site.save();
        }

        res.status(200).json({ message: "Supervisors uploaded successfully", supervisors: savedSupervisors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

