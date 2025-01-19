import SitesModel from "../Models/Sites.model.js";

export const createSite = async (req, res) => {
  try {
    const { engineerId } = req.user;
    const { siteName, siteAddress } = req.body;
    if (!siteName || !siteAddress)
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    const site = await SitesModel.create({
      siteName,
      siteAddress,
      engineerId,
    });
    await site.save();
    res.status(200).json({
      message: "Site created successfully",
      site,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//edit site
export const editSite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { siteName, siteAddress } = req.body;
    if (!siteName || !siteAddress)
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    const site = await SitesModel.findOneAndUpdate(
      { _id: siteId },
      {
        siteName,
        siteAddress,
      }
    );
    res.status(200).json({
      message: "Site created successfully",
      site,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
