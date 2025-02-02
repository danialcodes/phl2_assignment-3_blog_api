# Blog Platform Backend

## Overview
The Blog Platform Backend is a robust and secure REST API that powers a blogging system where users can create, update, and delete their blogs. The system features role-based access control, authentication, and public APIs for browsing blogs with advanced filtering and sorting capabilities.

## Live URL
- [API URL](https://phl2-ass3.danialcodes.xyz) *(hosted in vercel)*

- [GITHUB URL](https://github.com/danialcodes/phl2_assignment-3_blog_api)

- [Video URL](https://youtu.be/rzpLur2-8Zk) *(Youtube)*


## Admin Login Crediential

- **Email:** admin@blogapi.com
- **Password:** adminpassword

## Features
- **User Authentication**: Secure registration and login system with JWT-based authentication.
- **Role-Based Access Control**: Admins and Users have distinct permissions.
- **Blog Management**: Users can create, edit, and delete their own blogs.
- **Admin Privileges**: Admins can delete any blog and block users.
- **Public Blog API**: Fetch blogs with search, sort, and filter functionalities.
- **Robust Error Handling**: Consistent error responses for easy debugging.

## Technology Stack
- **Language**: TypeScript
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod for schema validation

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/installation)
- [MongoDB](https://www.mongodb.com/)

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/danialcodes/phl2_assignment-3_blog_api.git
   cd phl2_assignment-3_blog_api
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Create a `.env` file and configure the environment variables:
   ```env
    NODE_ENV=
    PORT=5000
    DATABASE_URL=
    BCRYPT_SALT_ROUNDS=15
    JWT_ACCESS_SECRET=
    JWT_REFRESH_SECRET=
    JWT_ACCESS_EXPIRES_IN=<use milliseconds>
    JWT_REFRESH_EXPIRES_IN=<use milliseconds>
   ```
4. Start the server:
   ```sh
   pnpm run start:dev
   ```
   The server will run on `http://localhost:5000/` by default.

## API Endpoints

### Authentication
#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "statusCode": 201,
    "data": {
      "_id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```

#### Login User
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "statusCode": 200,
    "data": {
      "token": "string"
    }
  }
  ```

### Blog Management
#### Create Blog
- **Endpoint:** `POST /api/blogs`
- **Authentication:** Bearer Token (User required)
- **Request Body:**
  ```json
  {
    "title": "My First Blog",
    "content": "This is the content of my blog."
  }
  ```

#### Update Blog
- **Endpoint:** `PATCH /api/blogs/:id`
- **Authentication:** Bearer Token (User required)

#### Delete Blog
- **Endpoint:** `DELETE /api/blogs/:id`
- **Authentication:** Bearer Token (User required)

### Admin Actions
#### Block User
- **Endpoint:** `PATCH /api/admin/users/:userId/block`
- **Authentication:** Bearer Token (Admin required)

#### Delete Any Blog
- **Endpoint:** `DELETE /api/admin/blogs/:id`
- **Authentication:** Bearer Token (Admin required)

## Error Handling
All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "error": { "details" },
  "stack": "error stack trace (if available)"
}
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

---
For further inquiries, contact **danialcodes@gmail.com**.

