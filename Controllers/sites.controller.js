import SitesModel from "../Models/Sites.model.js";

export const createSite = async (req, res) => {
  try {
    const { id } = req.user;
    const { siteName, siteAddress } = req.body;
    if (!siteName || !siteAddress)
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    const site = await SitesModel.create({
      siteName,
      siteAddress,
      engineerId: id,
    });
    await site.save();
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
