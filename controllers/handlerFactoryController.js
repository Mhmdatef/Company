const APIFeatures = require("../utils/apiFeatures");
const logger = require("../utils/logger");

exports.deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Doc not found" });
    }

    logger.info(`${req.admin.name} deleted ${Model.modelName}: ${doc._id}`);

    res.status(204).json({ message: "Doc deleted" });
  } catch (error) {
    logger.error(`Error deleting ${Model.modelName}: ${error.message}`); // Logging
    res.status(500).json({ message: error.message });
  }
};

exports.updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({ message: "Doc not found" });
    }

    logger.info(`${req.admin.name} updated ${Model.modelName}: ${doc._id}`);

    res.status(200).json({ message: "Doc updated successfully", data: doc });
  } catch (error) {
    logger.error(`Error updating ${Model.modelName}: ${error.message}`); // Logging
    res.status(500).json({ message: error.message });
  }
};

exports.createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);

    logger.info(`${req.admin.name} created a new ${Model.modelName}: ${doc._id}`);

    res.status(201).json({ message: "Doc created successfully", data: doc });
  } catch (error) {
    logger.error(`Error creating ${Model.modelName}: ${error.message}`); // Logging
    res.status(500).json({ message: error.message });
  }
};

exports.getOne = (Model, populateOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    res.status(200).json({ data: doc });
  } catch (error) {
    logger.error(`Error fetching ${Model.modelName}: ${error.message}`); // Logging
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = (Model, populateOptions) => async (req, res) => {
  try {
    let filter = {};
    if (req.params.Id) filter = { docs: req.params.Id };

    let features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (populateOptions)
      features.query = features.query.populate(populateOptions);

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  } catch (error) {
    logger.error(`Error fetching all ${Model.modelName}: ${error.message}`); // Logging
    res.status(500).json({ message: error.message });
  }
};
