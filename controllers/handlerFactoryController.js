const APIFeatures = require("../utils/apiFeatures");
exports.deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        message: "Doc dnot found",
      });
    }
    res.status(204).json({
      message: "Doc deleted ",
    });
  } catch (error) {
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
      return res.status(404).json({
        message: "Doc dnot found",
      });
    }
    res.status(200).json({
      message: "doc updated successfully",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      message: "doc created successfully",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getOne = (Model, populateOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;

    if (!doc) {
      return res.status(404).json({
        message: "Doc dnot found",
      });
    }
    res.status(200).json({
      data: doc,
    });
  } catch (error) {
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

    if (populateOptions) {
      features.query = features.query.populate(populateOptions);
    }

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
