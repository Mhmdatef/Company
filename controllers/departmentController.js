const handlerFactory = require('./handlerFactoryController');
const Department = require('../models/departmentModel');
exports.getAllDepartments = handlerFactory.getAll(Department);
exports.getDepartment = handlerFactory.getOne(Department);
exports.createDepartment = handlerFactory.createOne(Department);
exports.updateDepartment = handlerFactory.updateOne(Department);
exports.deleteDepartment = handlerFactory.deleteOne(Department);
