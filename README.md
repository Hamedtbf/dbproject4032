# سامانه رزرو بلیط (Ticket Reservation System)

This is a full-stack web application designed to simulate a ticket reservation platform, similar to popular Persian platforms. It features a complete back-end API built with Node.js and Express, and a dynamic front-end built with Angular. The entire application stack is containerized with Docker for easy setup and deployment.

---

## ✨ Features

- **User Authentication**: Secure user registration and login with JWT (JSON Web Tokens) and OTP verification.
- **Ticket Search**: High-performance ticket searching powered by Elasticsearch.
- **Reservation System**: Users can reserve tickets, which are held for a 10-minute payment window.
- **Payment Flow**: Simulated payment process using a user's account balance.
- **Purchase History**: Users can view their paid tickets and initiate cancellations.
- **Admin Panel**: A dedicated interface for administrators to manage all user reservations and reports.
- **Persian UI**: The front-end is localized for an Iranian audience, featuring RTL layout, Persian fonts, and Jalali dates.

---

## 🚀 Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Backend** | Node.js, Express.js                           |
| **Frontend** | Angular                                       |
| **Database** | MySQL 8.0                                     |
| **Caching** | Redis                                         |
| **Search** | Elasticsearch 8.11+                           |
| **Container** | Docker, Docker Compose                        |

---

## 📂 Project Structure

The project is organized into a monorepo structure with three main directories at the root:


ticket-reservation-app/
├── backend/         # Contains the Node.js/Express back-end API
├── frontend/        # Contains the Angular front-end application
├── database/        # Contains the initial SQL scripts for database setup
└── docker-compose.yml # The master file to run the entire application


---

## 🐳 Setup and Installation with Docker

This project is designed to be run entirely with Docker. This ensures a consistent and easy setup process without needing to install databases or other services directly on your machine.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your system.

### Step 1: Configure the Backend Environment

Before running the application, you need to create an environment file for the backend.

1.  Navigate to the `backend` folder.
2.  Create a new file named `.env`.
3.  Copy and paste the following content into it, **making sure to replace `your_strong_password` with the password you set in the `docker-compose.yml` file (`Mysql2025`).**

    ```env
    # backend/.env

    # Server Port
    PORT=3000

    # These variables are for local development. Docker Compose will override them.
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_strong_password
    DB_NAME=ticket_reservation
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    ES_HOST=http://localhost:9200

    # JWT Configuration
    JWT_SECRET=this-is-a-super-secret-key-change-it
    JWT_EXPIRES_IN=90d
    OTP_TTL_SECONDS=300
    ```

### Step 2: Run the Application

1.  Make sure you are in the root directory of the project (`ticket-reservation-app/`).
2.  Run the following command in your terminal:

    ```bash
    docker-compose up --build
    ```

    - `--build`: This flag tells Docker to build the `backend` and `frontend` images from their respective `Dockerfiles` the first time you run it, or if you've made any changes to them.

### What Happens When You Run `docker-compose up`?

This single command orchestrates the entire application startup in the correct order:
1.  **Databases Start**: The `mysql-db`, `redis-cache`, and `elasticsearch` containers are started.
2.  **MySQL Initialization**: The MySQL container detects that its data volume is empty and automatically executes the `.sql` files located in the `database/` folder to create your tables and insert the sample data.
3.  **Data Sync**: The `es-syncer` service starts. It waits for both MySQL and Elasticsearch to be healthy, then runs the `scripts/sync.js` script to copy the ticket data from MySQL into Elasticsearch. After it's done, this container exits.
4.  **Backend API Starts**: The `backend` service waits for the `es-syncer` to complete successfully, then starts the Node.js server.
5.  **Frontend UI Starts**: The `frontend` service starts the Angular development server.

---

## 💻 Usage

Once all the containers are running, you can access the different parts of the application:

- **Frontend Application**: [http://localhost:4200](http://localhost:4200)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Kibana (Elasticsearch UI)**: [http://localhost:5601](http://localhost:5601)

You can log in with the following credentials:
- **Customer**: Create a new user through the signup page.
- **Admin**:
  - **Email**: `admin@example.com`
  - **Password**: `admin`
