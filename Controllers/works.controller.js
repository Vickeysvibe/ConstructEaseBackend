import WorksModel from "../Models/Works.model";

export const createWorks = async (req, res) => {
  try {
    const { title, description, date, additionalSites, siteId } = req.body;
    const newWork = new WorksModel({
      title,
      description,
      date,
      additionalSites,
      siteId,
    });
    const savedWork = await newWork.save();
    res.status(200).json(savedWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createColumns = async (req, res) => {
  try {
    const { columnName, siteId } = req.body;

    // Validate input
    if (!columnName) {
      return res.status(400).json({ message: "Column name is required." });
    }

    // Ensure columnName doesn't contain invalid characters
    if (columnName.includes(".") || columnName.startsWith("$")) {
      return res.status(400).json({
        message: "Column name cannot contain '.' or start with '$'.",
      });
    }

    // Check if the siteId is provided and valid
    if (!siteId) {
      return res.status(400).json({ message: "siteId is required." });
    }

    // Check if the column already exists in any document for this siteId
    const existingWork = await WorksModel.findOne({
      siteId,
      [`additionalCols.${columnName}`]: { $exists: true },
    });

    if (existingWork) {
      return res.status(400).json({
        message: `Column "${columnName}" already exists for siteId: ${siteId}.`,
      });
    }

    // Add the new column to all documents for the given siteId
    const result = await WorksModel.updateMany(
      { siteId },
      { $set: { [`additionalCols.${columnName}`]: "" } }
    );

    res.status(200).json({
      message: `Column "${columnName}" added successfully to all documents for siteId: ${siteId}.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding the column.",
      error: error.message,
    });
  }
};

export const getAllWorks = async (req, res) => {
  try {
    const { siteId } = req.query;
    const works = await WorksModel.find({ siteId });
    res.status(200).json(works);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editColumn = async (req, res) => {
  try {
    const { columnName, editedName, siteId } = req.body;

    // Validate input
    if (!columnName || !editedName) {
      return res
        .status(400)
        .json({ message: "Both columnName and editedName are required." });
    }

    if (!siteId) {
      return res.status(400).json({ message: "siteId is required." });
    }

    // Ensure the edited column name doesn't contain invalid characters
    if (editedName.includes(".") || editedName.startsWith("$")) {
      return res.status(400).json({
        message: "editedName cannot contain '.' or start with '$'.",
      });
    }

    // Check if the column to edit exists in any document for this siteId
    const existingColumn = await WorksModel.findOne({
      siteId,
      [`additionalCols.${columnName}`]: { $exists: true },
    });

    if (!existingColumn) {
      return res.status(404).json({
        message: `Column "${columnName}" does not exist for siteId: ${siteId}.`,
      });
    }

    // Rename the column in all documents for the specified siteId
    const result = await WorksModel.updateMany(
      { siteId },
      {
        $rename: {
          [`additionalCols.${columnName}`]: `additionalCols.${editedName}`,
        },
      }
    );

    res.status(200).json({
      message: `Column "${columnName}" has been successfully renamed to "${editedName}" for siteId: ${siteId}.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while renaming the column.",
      error: error.message,
    });
  }
};

export const editWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { title, description, date, additionalSites } = req.body;
    const updatedWork = await WorksModel.findByIdAndUpdate(
      workId,
      { title, description, date, additionalSites },
      { new: true }
    );
    res.status(200).json(updatedWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { columnName, siteId } = req.body;

    // Validate input
    if (!columnName) {
      return res.status(400).json({ message: "Column name is required." });
    }

    if (!siteId) {
      return res.status(400).json({ message: "siteId is required." });
    }

    // Check if the column to delete exists in any document for this siteId
    const existingColumn = await WorksModel.findOne({
      siteId,
      [`additionalCols.${columnName}`]: { $exists: true },
    });

    if (!existingColumn) {
      return res.status(404).json({
        message: `Column "${columnName}" does not exist for siteId: ${siteId}.`,
      });
    }

    // Delete the column from all documents for the specified siteId
    const result = await WorksModel.updateMany(
      { siteId },
      {
        $unset: { [`additionalCols.${columnName}`]: "" },
      }
    );

    res.status(200).json({
      message: `Column "${columnName}" has been successfully deleted for siteId: ${siteId}.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the column.",
        error: error.message,
      });
  }
};

export const deleteWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const deletedWork = await WorksModel.findByIdAndDelete(workId);
    res.status(200).json(deletedWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
