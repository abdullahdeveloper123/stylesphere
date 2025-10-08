# 🛍️ E-Commerce Store (Frontend)

A modern and responsive **eCommerce frontend** built with **React**, **Tailwind CSS**, and **CRACO**.
This project delivers a sleek user interface for browsing products, managing the cart, and handling checkout — designed for performance, scalability, and clean architecture.

---

## 📁 Folder Structure

```
project-root/
├── frontend/           # React frontend (UI)
│   └── ...
├── backend/            # Flask backend (API server)
│   ├── server.py
│   ├── requirements.txt
│   ├── data.db
│   └── flask_session/
└── README.md
```

---

## 🔁 Backend (Flask)

A lightweight Flask API that serves product data, authentication, and order endpoints. The backend uses a file-based SQLite database (`data.db`) and Flask session for simple session management.

### 🧰 Backend Tech Stack

* Python 3.x
* Flask
* Flask-Bcrypt
* Flask-Session
* SQLite (file-based)
* python-dotenv (optional)

### 📂 Backend Folder Structure

```
backend/
├── server.py           # Main Flask application
├── wsgi.py             # WSGI entrypoint
├── requirements.txt    # Python dependencies
├── data.db             # SQLite database (included)
└── flask_session/      # session files
```

### ⚙️ Run the backend (local)

```bash
# 1. Navigate to backend folder
cd backend

# 2. (recommended) create and activate virtualenv
python -m venv venv
# Linux / macOS
source venv/bin/activate
# Windows (PowerShell)
venv\\Scripts\\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
python server.py
# The server listens on port 8001 by default (http://localhost:8001)
```

> Optional environment variables (create a `.env` in `backend/`):

```
CORS_ORIGINS=*
SQLITE_PATH=./data.db
```

### 🔗 API Endpoints (summary)

* `GET /api/` — root/info
* `GET /api` — same root
* `POST /api/register` — register new user
* `POST /api/login` — login
* `POST /api/logout` — logout
* `GET /api/profile` — get profile
* `PUT /api/profile` — update profile
* `GET /api/categories` — list categories
* `GET /api/products` — list products
* `GET /api/products/<product_id>` — product detail
* `GET /api/check-auth` — check authentication status
* `POST /api/orders` — create order
* `GET /api/orders` — list orders
* `GET /api/orders/<order_id>` — get order detail

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git

# 2️⃣ Navigate to the project directory
cd frontend

# 3️⃣ Install dependencies
npm install
# or
yarn install

# 4️⃣ Start the development server
npm start
# or
yarn start
```

The app should now be running at `http://localhost:3000/`.

---

## 📸 Screenshots

> Add your screenshots here once deployed or during development.


## 🖼️ Project Screenshots

![Home Page](https://github.com/user-attachments/assets/4529b627-3ec2-4189-a3da-d6cdef1192f8)
*Home Page*

![Products Page](https://github.com/user-attachments/assets/533333a9-658c-413e-acc6-ec1df0eef010)
*Products Page*

![Product Detail](https://github.com/user-attachments/assets/79caa8b4-1d67-49cf-88cf-54b2c182020b)
*Product Detail Page*

![Checkout Page](https://github.com/user-attachments/assets/bc315206-d9d7-48a5-89d3-5732f2a7101b)
*Checkout Page*

![User Profile](https://github.com/user-attachments/assets/4e7a8680-bf1b-40d6-9937-f2f043b6658b)
*User Profile Page*


---

## 🔧 Build for Production

```bash
npm run build
```

The optimized production build will be available in the `build/` folder.

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify for your own projects.

---

## 👤 Author

**Abdullah Hussain**
Full Stack Developer | Passionate about clean UI and scalable backend design.
🔗 [LinkedIn](https://www.linkedin.com/in/abdullah-hussain-b76801387/)
💻 [GitHub](https://github.com/abdullahdeveloper123)

---

⭐ *If you like this project, give it a star on GitHub!*
