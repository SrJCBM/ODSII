# Customer Management System

A web service built with Flask and MongoDB for managing customer data.

## Features

- ✅ Create, Read, Update, Delete (CRUD) operations for customers
- ✅ Clean architecture with separation of concerns
- ✅ Form validation using Flask-WTF
- ✅ Responsive UI with Bootstrap 5
- ✅ MongoDB integration using pymongo
- ✅ Flash messages for user feedback

## Project Structure

```
WS24WebService/
├── src/
│   ├── models/          # Data models (Customer)
│   ├── repositories/    # Database access layer
│   ├── services/        # Business logic
│   ├── routes/          # Flask routes/controllers
│   └── forms/           # Flask-WTF forms
├── config/              # Database configuration
├── templates/           # HTML templates (Jinja2)
├── static/              # Static files (CSS, JS)
│   └── css/
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── requirements.txt     # Python dependencies
├── app.py              # Application entry point
└── README.md           # This file
```

## Installation

1. **Clone or navigate to the project directory**

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables**:
   - The `.env` file is already configured with the MongoDB connection string
   - Optionally modify the `SECRET_KEY` for production

## Running the Application

1. **Activate the virtual environment** (if not already activated):
   ```bash
   venv\Scripts\activate
   ```

2. **Run the Flask application**:
   ```bash
   python app.py
   ```

3. **Access the application**:
   - Open your browser and navigate to: `http://localhost:5000`

## Database Configuration

- **MongoDB Atlas URI**: `mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0`
- **Database**: `oop`
- **Collection**: `Customers`

## Customer Fields

- **id** (Integer): Unique customer identifier
- **fullName** (String): Customer's full name
- **email** (String): Customer's email address
- **type** (String): Customer type (Frequent, Regular, VIP, New)
- **discount** (Float): Discount percentage (0-100)
- **totalSale** (Float): Total sales amount

## API Routes

- `GET /` - List all customers
- `GET /customer/new` - Display form to create a new customer
- `POST /customer/new` - Submit new customer data
- `GET /customer/<id>` - View customer details
- `GET /customer/<id>/edit` - Display form to edit customer
- `POST /customer/<id>/edit` - Submit updated customer data
- `POST /customer/<id>/delete` - Delete a customer

## Technologies Used

- **Flask 3.0.0** - Web framework
- **Flask-WTF 1.2.1** - Form handling and validation
- **pymongo 4.6.1** - MongoDB driver
- **python-dotenv 1.0.0** - Environment variable management
- **Bootstrap 5.3.0** - CSS framework
- **Bootstrap Icons** - Icon library

## Architecture Principles

This project follows Clean Code and SOLID principles:

- **Separation of Concerns**: Models, repositories, services, and routes are in separate layers
- **Single Responsibility**: Each class has one well-defined purpose
- **Dependency Injection**: Services depend on repositories through constructor injection
- **Repository Pattern**: Data access is abstracted through the repository layer
- **Service Layer**: Business logic is centralized in the service layer

## Development

To modify or extend the application:

1. **Models**: Add or modify entity classes in `src/models/`
2. **Database Operations**: Update repository methods in `src/repositories/`
3. **Business Logic**: Implement services in `src/services/`
4. **Routes**: Add new endpoints in `src/routes/`
5. **Forms**: Create new forms in `src/forms/`
6. **Templates**: Design UI in `templates/`

## License

This project is for educational purposes.

## Author

Developed as part of Web Development coursework.
