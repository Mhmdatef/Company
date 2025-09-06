# Company Management System

A backend system for managing employees and admins, featuring secure authentication, employee CRUD operations, PDF and Excel export, and email notifications. Built with Node.js, Express, and MongoDB.

---

## Description

The **Company Management System** provides robust APIs for employee and admin management. It supports admin authentication, password resets via email, and the ability to export employee data to PDF and Excel. The project includes Swagger-powered API documentation for easy integration and testing.

---

## Features

- **Employee CRUD:** Create, read, update, and delete employee records.
- **Admin Authentication:** Secure login and role-based access for admins.
- **Password Reset via Email:** Request and reset forgotten passwords through email.
- **Export Employees:** Download employee lists as PDF or Excel files.
- **Swagger API Documentation:** Interactive API docs at `/api-docs`.

---

## Requirements

- **Node.js** v20+
- **MongoDB** (local or cloud)
- **npm packages:**
  - `express`
  - `mongoose`
  - `bcrypt`
  - `validator`
  - `exceljs`
  - `nodemailer`
  - `swagger-jsdoc`
  - `swagger-ui-express`

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mhmdatef/Company.git
   cd Company
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) below).

4. **Start MongoDB**

   Ensure MongoDB is running locally or use a cloud provider (e.g., MongoDB Atlas).

5. **Run the server**
   ```bash
   npm start
   ```
   Or for live-reloading during development:
   ```bash
   npm run dev
   ```

---

## Usage

- The server will start on the port specified in your `.env` file (default: `2500`).
- Access Swagger API docs at: [http://localhost:2500/api-docs](http://localhost:2500/api-docs)
- Use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for API testing.

---

## API Documentation

The project uses **Swagger** for interactive API documentation.

**Swagger Setup Example (in `app.js` or `server.js`):**

```js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Company Management System API',
      version: '1.0.0',
      description: 'API documentation for Company Management System',
    },
  },
  apis: ['./routes/*.js'], // Adjust this path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

- Document your endpoints using Swagger comments in your route files.
- Visit `/api-docs` after starting the server to view and test the APIs.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables as an example:

```env
NODE_ENV=development
PORT=2500
DATABASE=mongodb+srv://125moatef:123MoAtef@cluster0.9ujqg.mongodb.net/Company?retryWrites=true&w=majority&appName=Cluster0
DATABASE_PASSWORD=123MoAtef
SECRET=secret
EXPIRATION=90d

# Email settings (add as needed for nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
```

**Note:**  
- Update `DATABASE` or other secrets as needed for production.
- Use secure values for `SECRET`, `EMAIL_USER`, and `EMAIL_PASS`.
- Never commit sensitive data to version control!

---

## Notes

### Folder Structure (Typical Example)

```
/Company
  ├── controllers/    # Business logic for routes
  ├── models/         # Mongoose models (Employee, Admin)
  ├── routes/         # Express routers
  ├── utils/          # Utility functions (email, exports)
  ├── middlewares/    # Authentication, error handling
  ├── config/         # Configuration files
  ├── app.js          # App initialization
  └── server.js       # Server entry point
```

### Tips

- **Keep your `.env` file private** – never commit it to version control.
- **Use strong passwords and secrets** for production environments.
- **Customize Swagger docs** by adding detailed endpoint descriptions.
- **Validate user input** to prevent security vulnerabilities.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

**Happy coding!**
