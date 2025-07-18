# PT. ANG Web Admin/Product App

A Next.js application for managing products and admin users, using PostgreSQL for persistent storage.

---

## Features
- Admin login with JWT authentication
- Product CRUD (create, read, update, delete)
- Image upload for products
- PostgreSQL database integration
- Secure password hashing (bcrypt)

---

## Getting Started

### 1. **Clone the Repository**
```sh
git clone https://github.com/stephen18961/ANG.git
cd ANG
```

### 2. **Install Dependencies**
```sh
pnpm install
```

### 3. **Set Up Environment Variables**
- Copy `.env.example` to `.env.local`:
  ```sh
  cp .env.example .env.local
  ```
- Edit `.env.local` and fill in your PostgreSQL connection string and a secure JWT secret:
  ```env
  POSTGRES_URL="postgresql://postgres:yourpassword@localhost:5432/yourdbname"
  JWT_SECRET="your-very-secret-key"
  ```

### 4. **Set Up the Database**
- Make sure PostgreSQL is installed and running (default port: 5432).
- Create a new database (e.g., `shopdb`).
- Run the SQL schema to create tables and a default admin user:
  ```sh
  psql -U postgres -d yourdbname -f schema.sql
  ```
  - Default admin login: `admin` / `admin123`

### 5. **Start the Development Server**
```sh
pnpm dev
```
- The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage
- Log in as admin to access product management features.
- Add, edit, and delete products. Images are uploaded to `public/uploads`.
- All product and user data is stored in PostgreSQL.

---

## Project Structure
- `app/` - Next.js app routes and pages
- `components/` - React UI components
- `lib/` - Database and authentication utilities
- `types/` - TypeScript types
- `schema.sql` - Database schema

---

## Dependencies
- [Next.js](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [pg](https://www.npmjs.com/package/pg)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## License
MIT 