# Fanshawe Survey Recommendation Backend

This repository contains the **Node.js backend** for the College Recommendation System. It handles authentication, CRUD operations for diplomas, questions, and answers, and processes user questionnaire responses to recommend the best IT diploma.

## 📂 Project Structure

```
college-recommendation-backend/
│── src/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   ├── env.js             # Environment variables loader
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication middleware
│   ├── models/
│   │   ├── diplomaModel.js    # Diploma queries
│   │   ├── userModel.js       # Admin user queries
│   ├── routes/
│   │   ├── authRoutes.js      # Handles admin login
│   │   ├── diplomaRoutes.js   # CRUD for diplomas
│   ├── controllers/
│   │   ├── authController.js  # Handles authentication logic
│   │   ├── diplomaController.js # Handles diploma CRUD
│   ├── server.js              # Main server file
│── .env                       # Environment variables (DO NOT COMMIT)
│── .gitignore                 # Ignore unnecessary files
│── package.json               # Project metadata & scripts
│── README.md                  # Project documentation
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/andresmotta9/fanshawe-back.git
cd fanshawe-back
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root of the project:

```ini
DATABASE_URL=postgres://your_user:your_password@db.your_project.supabase.co:5432/postgres
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1h
```

🚨 **Do NOT share or commit `.env` to GitHub!**

### 4️⃣ Run the Server Locally

```sh
npm run dev
```

If everything is set up correctly, you should see:

```
Server running on http://localhost:3000
```

### 5️⃣ Test Database Connection

Open your browser or use Postman and visit:

```
http://localhost:3000/api/test-db
```

If successful, you’ll see:

```json
{
  "message": "Database connected!",
  "time": "2025-03-03T12:34:56.789012+00"
}
```

---

## 🔑 Authentication & Admin Access

### Creating an Admin User

1. **Generate a Hashed Password**

```sh
node hashPassword.js
```

2. **Insert the Admin User into PostgreSQL**

```sql
INSERT INTO admin_users (username, password_hash) VALUES
('admin1', '$2b$10$EXAMPLEHASHEDPASSWORD1234567890abcdef');
```

### Admin Login

Send a **POST** request to:

```
POST /api/auth/login
```

**Body:**

```json
{
  "username": "admin1",
  "password": "your_admin_password"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
```

Use this token to access protected routes.

---

## 🔒 Protected Branch Workflow

This repository enforces the following Git workflow:

- `main`, `uat`, and `develop` branches are **protected**.
- Developers must create **feature branches** and submit **pull requests (PRs)**.
- Only authorized users can merge into protected branches.

### **Workflow:**

1. Create a new feature branch:
   ```sh
   git checkout -b feature/my-feature develop
   ```
2. Make changes and commit:
   ```sh
   git add .
   git commit -m "Added new feature"
   ```
3. Push the branch:
   ```sh
   git push origin feature/my-feature
   ```
4. Create a **Pull Request** to `develop` in GitHub.
5. After testing, merge to `develop`, then `uat`, then `main`.

---

## 🌎 Deployment

This backend can be deployed on a **free server** (e.g., Railway, Render, or Fly.io). Once local development is stable, we will proceed with deployment.

---

## 🤝 Contribution Guidelines

1. Follow the **protected branch workflow**.
2. Ensure code follows the **modular structure**.
3. **Run tests** before submitting a PR.
4. Respect **team review processes** before merging.
