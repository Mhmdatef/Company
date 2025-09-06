const Admin = require("../models/adminModel");
const handleFactory = require("./handlerFactoryController");

exports.getAllAdmins = handleFactory.getAll(Admin);
exports.getAdmin = handleFactory.getOne(Admin);
exports.createAdmin = handleFactory.createOne(Admin);
exports.updateAdmin = handleFactory.updateOne(Admin);
exports.deleteAdmin = handleFactory.deleteOne(Admin);
exports.getMyProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    res.status(200).json({
      status: "success",
      data: {
        admin,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
