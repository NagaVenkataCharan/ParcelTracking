# Courier and Parcel Tracking Management System
## Project by K. Naga Venkata Charan

**Stack:** HTML, CSS, JavaScript, Express.js, Node.js and MySQL.

### Features
- Customer details capture and parcel booking.
- Auto-generated tracking number (`CT00000001` format).
- Parcel tracking with current status, location and event history.
- Staff dashboard to view bookings and update parcel status/location.
- MySQL relational tables, primary keys, foreign keys and indexes.

### Database tables and fields
- `customers`: `customer_id INT PK`, `name VARCHAR(100)`, `email VARCHAR(100)`, `phone VARCHAR(15)`, `address VARCHAR(255)`.
- `parcels`: `parcel_id INT PK`, `customer_id INT FK`, `sender_address VARCHAR(255)`, `receiver_name VARCHAR(100)`, `receiver_phone VARCHAR(15)`, `receiver_address VARCHAR(255)`, `weight DECIMAL(8,2)`, `booking_date DATE`, `status VARCHAR(30)`.
- `tracking`: `tracking_id INT PK`, `parcel_id INT FK`, `current_location VARCHAR(150)`, `tracking_status VARCHAR(50)`, `updated_at DATETIME`, `remarks VARCHAR(255)`.

### Setup (VS Code / Windows)
1. Install Node.js LTS and MySQL Server if they are not already installed.
2. Open this extracted folder in VS Code.
3. Run `database/courier_tracking_db.sql` in MySQL Workbench or MySQL command line.
4. Copy `.env.example` to `.env`; set your MySQL password and database details. Never upload `.env`.
5. Open terminal in this folder and run `npm install`.
6. Run `npm start`.
7. Visit `http://localhost:3000`; staff dashboard: `http://localhost:3000/admin.html`.

### Git collaboration commands
Set identity once:
```bash
git config --global user.name "K. Naga Venkata Charan"
git config --global user.email "YOUR_GITHUB_EMAIL"
```
Initialize and push:
```bash
git init
git add .
git commit -m "Initial courier parcel tracking system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/courier-parcel-tracking-charan.git
git push -u origin main
```
Team workflow:
```bash
git pull origin main
git switch -c feature/tracking-updates
# edit and test
git add .
git commit -m "Add parcel tracking updates"
git push -u origin feature/tracking-updates
```
Open a Pull Request on GitHub and review changes before merging.

### API endpoints
- `POST /api/customers` — create customer
- `GET /api/customers` — list customers
- `POST /api/parcels` — create parcel booking
- `GET /api/parcels` — list parcel bookings
- `GET /api/track/:trackingNumber` — track a parcel
- `POST /api/parcels/:id/tracking` — add tracking event
- `GET /api/health` — API health check

### Important
This is an academic prototype. Staff page and write APIs do not have authentication/role-based authorization. Do not deploy publicly without authentication, authorization, validation, HTTPS, rate limiting, audit logs and secure secrets management. Do not use real sensitive customer data.
