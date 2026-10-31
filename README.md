# 🛒 Shop — E-Commerce REST API

A production-ready **E-Commerce backend REST API** built with **Node.js**, **Express.js**, and **MongoDB**. It supports complete user authentication, product management, order processing, reviews/ratings, and an admin panel — all secured with JWT-based auth.

---

## 🚀 Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Runtime      | Node.js                              |
| Framework    | Express.js                           |
| Database     | MongoDB (via Mongoose)               |
| Auth         | JWT (Access + Refresh Token)         |
| Security     | Helmet, bcryptjs, cookie-parser      |
| Email        | Nodemailer                           |
| Logging      | Morgan                               |
| Dev Tool     | Nodemon                              |

---

## 📁 Project Structure

```
shop/
├── backend/
│   ├── config/
│   │   ├── dbConnec.js          # MongoDB connection
│   │   └── .env-example         # Environment variable template
│   ├── controllers/
│   │   ├── users.js             # User logic
│   │   ├── products.js          # Product logic
│   │   └── orders.js            # Order logic
│   ├── helpers/
│   │   ├── asyncCatch.js        # Async error wrapper
│   │   ├── errorHandler.js      # Custom error class
│   │   └── responseHandler.js   # Standardized response format
│   ├── middleware/
│   │   ├── auth.js              # JWT authorization middleware
│   │   └── error.js             # 404 & 500 error handlers
│   ├── models/
│   │   ├── users.js             # User schema
│   │   ├── products.js          # Product schema
│   │   └── orders.js            # Order schema
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   ├── users.js             # User routes
│   │   ├── products.js          # Product routes
│   │   └── orders.js            # Order routes
│   ├── services/
│   │   └── product.js           # Product service layer
│   ├── utils/
│   │   └── sendEmail.js         # Email utility (Nodemailer)
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shubhamprajapati1202/shop.git
cd shop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example env file and fill in the values:

```bash
cp backend/config/.env-example backend/config/.env
```

```env
API_HOST=localhost
API_PORT=5000
API_VERSION=/api/v1

DB_URI=mongodb://127.0.0.1:27017/shop

PASSWORD_SALT=10

JWT_ACCESS_TOKEN=your_access_token_secret
JWT_REFRESH_TOKEN=your_refresh_token_secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE=1d
JWT_REFRESH_TOKEN_EXPIRE=7d

CRYPTO_RANDOM_BYTES=32
CRYPTO_HASH_ALGO=sha256
```

### 4. Start Development Server

```bash
npm run dev
```

API will run at: `http://localhost:5000/api/v1`

---

## 📡 API Endpoints

### 👤 Users — `/api/v1/users`

| Method | Endpoint                    | Auth     | Description                  |
|--------|-----------------------------|----------|------------------------------|
| POST   | `/`                         | Public   | Register new user            |
| POST   | `/login`                    | Public   | Login user                   |
| POST   | `/logout`                   | Public   | Logout user                  |
| GET    | `/profile/me`               | User     | Get own profile              |
| PUT    | `/profile/update`           | User     | Update own profile           |
| PUT    | `/password/update`          | User     | Change password              |
| PUT    | `/password/forgot`          | Public   | Send password reset email    |
| PUT    | `/password/reset/:token`    | Public   | Reset password via token     |
| GET    | `/`                         | Admin    | List all users               |
| GET    | `/:id`                      | Admin    | Get user by ID               |
| PUT    | `/:id`                      | Admin    | Update user by ID            |
| DELETE | `/:id`                      | Admin    | Delete user by ID            |

---

### 📦 Products — `/api/v1/products`

| Method | Endpoint                        | Auth     | Description                    |
|--------|---------------------------------|----------|--------------------------------|
| GET    | `/`                             | Public   | List all products              |
| GET    | `/:id`                          | Public   | Get product by ID              |
| GET    | `/reviews/:productId`           | Public   | Get product reviews & ratings  |
| PUT    | `/reviews/:productId`           | User     | Add or update a review         |
| DELETE | `/reviews/:productId/:reviewId` | User     | Delete a review                |
| POST   | `/`                             | Admin    | Create new product             |
| PUT    | `/:id`                          | Admin    | Update product by ID           |
| DELETE | `/:id`                          | Admin    | Delete product by ID           |

---

### 🧾 Orders — `/api/v1/orders`

| Method | Endpoint | Auth  | Description        |
|--------|----------|-------|--------------------|
| POST   | `/`      | User  | Place a new order  |
| GET    | `/`      | Admin | Get all orders     |

---

## 🔐 Security Features

- **JWT Authentication** — Access & Refresh tokens stored in HTTP-only cookies
- **Role-based Authorization** — `user` and `admin` roles
- **Password Hashing** — bcryptjs with configurable salt rounds
- **Secure Headers** — Helmet.js applied globally
- **Password Reset** — Crypto-signed, time-limited reset tokens (15 min expiry)
- **Email Notifications** — Via Nodemailer for password reset flow

---

## 🗃️ Data Models

### User
- `name`, `email`, `phone`, `password` (hashed), `role` (`user` / `admin`)
- `resetPasswordToken`, `resetPasswordTokenExpire`

### Product
- `name`, `category`, `description`
- `mrp`, `salePrice`, `stock`, `stockStatus` (`instock` / `out of stock`)
- `images[]`, `reviews[]`, `numberOfRatings`, `numberOfReviews`
- `added_by` → ref: `users`

### Order
- `user` → ref: `users`
- `orderItems[]` → `name`, `price`, `quantity`, `images`, `product_id`
- `shippingAddress` → `address1`, `address2`, `city`, `state`, `country`, `pincode`, `phone`
- `paymentInfo` → `id`, `status`
- `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice`
- `orderStatus` → `Processing` / `Shipped` / `Delivered`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with ❤️ by [Shubham Prajapati](https://github.com/shubhamprajapati1202)

