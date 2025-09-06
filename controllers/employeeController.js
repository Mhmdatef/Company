const handlerFactory = require("./handlerFactoryController");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const XLSX = require("xlsx");
const path = require("path");
const Employee = require("../models/employeeModel");
const ExcelJS = require("exceljs");
exports.getAllEmployees = handlerFactory.getAll(Employee, {
  path: "department",
  select: "name  -_id",
});
exports.getEmployee = handlerFactory.getOne(Employee, {
  path: "department",
  select: "name  -_id",
});
exports.updateEmployee = handlerFactory.updateOne(Employee);
exports.deleteEmployee = handlerFactory.deleteOne(Employee);
exports.createEmployee = handlerFactory.createOne(Employee);

// Export employees to PDF with optional department filter
exports.exportEmployeesToPDF = async (req, res, next) => {
  try {
    const { department } = req.query;

    // Filter employees by department if provided
    const query = department ? { department } : {};
    const employees = await Employee.find(query).populate({
      path: "department",
      select: "name -_id",
    });

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    const folderPath = path.join(__dirname, "../employees.pdf");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const fileName = `employees_${department || "all"}_${Date.now()}.pdf`;
    const filePath = path.join(folderPath, fileName);

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(fs.createWriteStream(filePath));

    // Title
    doc.fontSize(20).text("Employee List", { align: "center" });
    doc.moveDown();

    // Table headers
    const headerY = doc.y;
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Name", 50, headerY);
    doc.text("Email", 150, headerY);
    doc.text("Department", 350, headerY);
    doc.text("Salary", 450, headerY);
    doc.moveDown();

    // Table rows
    doc.font("Helvetica");
    let y = doc.y + 5;
    const rowHeight = 20;
    employees.forEach((emp) => {
      doc.text(emp.name, 50, y);
      doc.text(emp.email, 150, y);
      doc.text(emp.department ? emp.department.name : "", 350, y);
      doc.text(emp.salary ? emp.salary.toString() : "", 450, y);
      y += rowHeight;
    });

    doc.end();

    res.status(200).json({
      status: "success",
      message: `PDF saved successfully`,
      file: filePath,
    });
  } catch (err) {
    next(err);
  }
};

// Export employees to Excel with optional department filter
exports.exportEmployeesToExcel = async (req, res, next) => {
  try {
    const { department } = req.query;

    // Filter employees by department if provided
    const query = department ? { department } : {};
    const employees = await Employee.find(query).populate({
      path: "department",
      select: "name -_id",
    });

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    const folderPath = path.join(__dirname, "../employees.Excel");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const fileName = `employees_${department || "all"}_${Date.now()}.xlsx`;
    const filePath = path.join(folderPath, fileName);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    // Add columns and make header bold
    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Department", key: "department", width: 25 },
      { header: "Salary", key: "salary", width: 15 },
    ];
    worksheet.getRow(1).font = { bold: true };

    // Add rows
    employees.forEach((emp) => {
      worksheet.addRow({
        name: emp.name,
        email: emp.email,
        department: emp.department ? emp.department.name : "",
        salary: emp.salary ? emp.salary.toString() : "",
      });
    });

    // Save file
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({
      status: "success",
      message: "Excel file saved successfully",
      file: filePath,
    });
  } catch (err) {
    next(err);
  }
};

exports.importEmployeesFromExcel = async (req, res) => {
  let file;
  try {
    file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please upload a file" });
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);
    if (!data.length) {
      fs.unlinkSync(file.path);
      return res
        .status(400)
        .json({ status: "fail", message: "Excel sheet is empty" });
    }

    const requiredFields = [
      "Name",
      "Email",
      "Department",
      "Salary",
      "Password",
      "PasswordConfirm",
    ];
    const sheetHeaders = Object.keys(data[0]);
    const missingFields = requiredFields.filter(
      (field) => !sheetHeaders.includes(field)
    );

    if (missingFields.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        status: "fail",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const invalidPasswords = data.filter(
      (emp) => emp.Password !== emp.PasswordConfirm
    );
    if (invalidPasswords.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        status: "fail",
        message: "Password and PasswordConfirm must match for all employees",
      });
    }

    const employeesData = data.map((emp) => ({
      name: emp.Name,
      email: emp.Email,
      department: emp.Department,
      salary: emp.Salary,
      password: emp.Password,
      passwordConfirm: emp.PasswordConfirm,
    }));

    const createdEmployees = await Employee.insertMany(employeesData);

    fs.unlinkSync(file.path);

    res.status(201).json({
      status: "success",
      message: "Employees imported successfully",
      count: createdEmployees.length,
      data: { employees: createdEmployees },
    });
  } catch (err) {
    if (file) fs.unlinkSync(file.path);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    employee = await Employee.findById(req.employee.id).populate({
      path: "department",
      select: "name -_id",
    });
    res.status(200).json({
      status: "success",
      data: {
        employee,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
exports.exportEmployeesToCSV = async (req, res, next) => {
  try {
    const { department } = req.query;

    // Filter employees by department if provided
    let query = {};
    if (department) {
      query = { department };
    }

    // Fetch employees from the database with populated department name
    const employees = await Employee.find(query).populate({
      path: "department",
      select: "name -_id",
    });

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    // Prepare CSV data
    const header = "Name,Email,Department,Salary\n";
    const rows = employees
      .map(
        (emp) =>
          `${emp.name},${emp.email},${emp.department ? emp.department.name : ""},${emp.salary}`
      )
      .join("\n");
    const csvData = header + rows;

    // Create folder if it doesn't exist
    const folderPath = path.join(__dirname, "../employees.CSV");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Generate filename with timestamp
    const fileName = `employees_${department || "all"}_${Date.now()}.csv`;
    const filePath = path.join(folderPath, fileName);

    // Save CSV file
    fs.writeFileSync(filePath, csvData);

    // Respond with file path
    res.status(200).json({
      status: "success",
      message: "CSV file saved successfully",
      file: filePath,
    });
  } catch (err) {
    next(err);
  }
};