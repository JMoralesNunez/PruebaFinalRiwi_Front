# Coder: Jhonatan Morales
## Clan: Van Rossum, C#
## Email: jhonatanmorales99@gmail.com
## c.c: 1000565363

---

# TalentoPlus - Frontend 🚀

**TalentoPlus** is a modern web application for Human Resources management. This repository contains the **Frontend** source code, built with **Vue 3** and **Vite**. It provides a user interface for Administrators to manage employees, view dashboards with AI, and for Employees to view their profiles and download CVs.

## 🛠️ Technologies Used

*   **Framework:** Vue 3 (Composition API)
*   **Build Tool:** Vite
*   **State Management:** Pinia
*   **Styling:** Bootstrap 5
*   **HTTP Client:** Axios
*   **Authentication:** JWT (JSON Web Tokens)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js** (Version 18.0 or higher recommended)
*   **npm** (Node Package Manager)
*   **Git**

---

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
Open your terminal and clone the repository:

```bash
git clone https://github.com/JMoralesNunez/PruebaFinalRiwi_Front.git
```
*(Make sure to navigate to the specific frontend folder).*

### 2. Install Dependencies
Install the required node modules:

```bash
npm install
```

---

## 🔌 Configuration

Before running the application, you need to ensure it connects to the Backend API correctly.

1.  Open the file `src/api/axios.js`.
2.  Check the `baseURL` property. It should point to your running Backend API port.

**If running locally (without Docker):**
```javascript
const api = axios.create({
    baseURL: 'http://localhost:5169/api', // Adjust 5169 to your .NET API port
    // ...
});
```

**If running with Docker:**
```javascript
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Docker mapped port
    // ...
});
```

> **Note:** Ensure your .NET Backend is running before starting the Frontend.

---

## ▶️ Running Locally (Dev Mode)

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

You will see an output similar to this:

```
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to **http://localhost:5173**.

---

## 🐳 Running with Docker

If you prefer to run the application in a containerized environment (along with the backend):

1.  Navigate to the root solution folder (where `docker-compose.yml` is located).
2.  Run:
    ```bash
    docker-compose up --build
    ```
3.  The application will be accessible at **http://localhost** (Port 80).

---

## 📂 Project Structure

*   `src/api`: Axios configuration and interceptors.
*   `src/stores`: Pinia stores for state management (Auth, etc.).
*   `src/views`: Page components (Login, Register, Dashboard, Employee Home).
*   `src/router`: Vue Router configuration and navigation guards.

---

## 🔑 Default Credentials

If the backend has been seeded, you can use the default Admin account:

*   **User/Email:** `admin` or `admin@talentoplus.com`
*   **Password:** `Admin123!`

For employee access, please use the **Register** page with a valid ID document present in the database.
