🚀 ChurnGuard — AI Customer Churn Prediction Dashboard

ChurnGuard is a full-stack SaaS dashboard that helps businesses predict customer churn risk and analyze retention patterns using uploaded customer datasets.
It provides interactive analytics, automated ML predictions, and risk segmentation to help teams identify at-risk customers early and improve retention strategies.

---

📊 Features

🔐 Authentication & Workspace

- Secure user authentication using JWT
- Workspace-based architecture for multi-user environments
- Register and manage company workspace

📂 CSV Data Upload

- Upload customer datasets using CSV
- Backend automatically processes the data
- Generates predictions for churn risk

🤖 Automated ML Prediction

- Automatic prediction triggered after dataset upload
- Customers classified into:
  - High Risk
  - Medium Risk
  - Low Risk

📈 Interactive Dashboard

Visual analytics including:

- Total Customers
- High Risk Customers
- Churn Rate
- Retention Rate
- Churn trend analysis
- Customer risk segmentation
- Monthly churn distribution

👥 Customer Insights

- View all customers with predicted churn probability
- Risk segmentation analysis
- Identify high churn probability customers

📊 Data Visualization

Charts built with Recharts:

- Line charts
- Pie charts
- Bar charts
- Interactive analytics dashboard

---

🏗️ Tech Stack

Frontend

- React.js
- Vite
- TailwindCSS
- Recharts
- Axios

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

Authentication

- JWT (JSON Web Tokens)

Data Processing

- CSV Parsing
- Python integration for ML prediction

---

🧠 Architecture

Client (React Dashboard)
        ↓
API Layer (Express.js)
        ↓
Authentication Middleware
        ↓
Services Layer
        ↓
MongoDB Database
        ↓
ML Prediction Pipeline

---

📁 Project Structure

churnguard-saas-dashboard
│
├── client/                # React frontend
│   ├── pages
│   ├── layouts
│   ├── hooks
│   ├── services
│   └── utils
│
├── server/                # Node.js backend
│   ├── routes
│   ├── models
│   ├── services
│   ├── utils
│   └── validators
│
└── README.md

---

⚙️ Installation

1️⃣ Clone the repository

git clone https://github.com/Mudavath-Swathi/churnguard-saas-dashboard.git

---

2️⃣ Install frontend dependencies

cd client
npm install

---

3️⃣ Install backend dependencies

cd ../server
npm install

---

4️⃣ Add environment variables

Create ".env" inside "server/"

PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

---

5️⃣ Run the backend

npm run dev

---

6️⃣ Run the frontend

cd client
npm run dev

---


💡 Use Cases

Businesses can use ChurnGuard to:

- Detect customers likely to leave
- Improve customer retention strategies
- Monitor churn trends
- Identify high-risk segments
- Analyze customer behavior patterns

---

🌟 Future Improvements

- Real-time churn prediction
- Email alerts for high-risk customers
- SaaS subscription plans
- Role-based access control
- Advanced ML models
- Automated data pipelines

---

👩‍💻 Author

Swathi Mudavath

B.Tech Aerospace Engineering
IIT Kharagpur

Passionate about full-stack development, data analytics, and AI-driven products.

GitHub:
https://github.com/Mudavath-Swathi

---

⭐ Support

If you found this project useful:

⭐ Star the repository
⭐ Share feedback
⭐ Connect on GitHub

---
