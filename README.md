# ToolWise

TOOLWISE is a web application designed for efficient tool management within organizations. It allows users to track, manage, and allocate tools seamlessly, ensuring optimal usage and maintenance.

![toolwise](https://github.com/user-attachments/assets/8f06335c-693d-45a5-8673-8428c506dc91)

## Features

- **User Authentication**: Secure login system for users to manage their profiles and access features.
- **Tool Inventory Management**: Easily add, update, and delete tools in the inventory.
- **Tool Allocation**: Assign tools to specific users or departments, with options to track availability.
- **Calibration Management**: Manage calibration schedules for tools, ensuring compliance with safety and operational standards.
- **Dynamic Filtering**: Filter tools and caisses based on various criteria, including type and service associations.
- **Search Functionality**: Robust search capabilities to quickly find tools or caisses by various attributes.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Spring Boot,
- **Database**: MySQL
- **Build Tool**: Maven//

## Installation

### Prerequisites

- Java 17 or higher
- Apache Maven 3.9.6
- MySQL database

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ToolWise
   ```

2. **Backend Setup**:
   - Navigate to the backend directory.
   - Update your database configuration in `application.properties`.
   - Build and run the Spring Boot application:
     ```bash
     mvn spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React application:
     ```bash
     npm start
     ```

4. **Access the Application**:
   Open your browser and go to `http://localhost:3000` to access the ToolWise application.

## Usage

- Sign up or log in to your account.
- Navigate through the dashboard to manage tools, view inventory, and allocate resources.
- Utilize the search and filter features to find specific tools or caisses quickly.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
