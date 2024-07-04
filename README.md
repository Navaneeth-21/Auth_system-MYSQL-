# Auth System with mysql 
A Basic Authentication System with user registration and login functionalities using Node.js , Express and Mysql . 
This project uses JWT for authenticating the users using tokens

## Features
 - It consists of following RESTful endpoints :
     - POST /register: Register a new user.
     - POST /login: Login a user and return a JWT.
     - GET /profile: Retrieve the logged-in user's profile information (protected endpoint).


## Technologies used

- **Backend:** Express.js , MYSQL , JWT , RESTAPI
- **Testing:** Jest,supertest

## Getting Started

### Prerequisites

- Node.js and npm installed
- Install MYSQL or MYSQL workbench and create a user

### Installation

1. clone the repository
2. Install all dependencies.
3. Create a .env file and enter the following details :
     - jwt_secret_key
     - user
     - host
     - password
     - Database name
4. Run the following SQL commands to set up the database and users table.
5. Start the application

       npm start

6. Run the following endpoints in postman or any other api requests extensions
     - Register :

           POST -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}' http://localhost:3000/api/auth/register

     - Login :

           POST -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}' http://localhost:3000/api/auth/login

    - Access protected route:

          -H "Authorization": Bearer <your_jwt_token> http://localhost:3000/api/auth/protected

## Testing
  Unit tests are written using jest. To run tests : 

    npm test
    

  




