# DevConnect-Lite (Backend) - Node.js + Express + MongoDB

## Requirements
- Node.js 16+
- MongoDB running locally or MongoDB Atlas
- npm

## Setup
1. clone repo
2. cd devconnect-lite
3. npm install
4. copy `.env.example` to `.env` and fill values:
   - MONGO_URI (e.g. mongodb://localhost:27017/devconnect-lite)
   - JWT_SECRET
5. npm run dev
6. Use Postman to test endpoints (see sample requests in README / scripts)

## Implemented routes
- POST /auth/signup/user
- POST /auth/signup/developer
- POST /auth/login
- POST /projects/create (user only)
- GET /projects/open (auth)
- POST /bids/place (developer only)
- (Bonus) GET /projects/:id/bids

## Notes
- Passwords hashed with bcrypt
- JWT used for login and auth; token contains id & role
- Models: User, Developer, Project, Bid (Mongoose)
