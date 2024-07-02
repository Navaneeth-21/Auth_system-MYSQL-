const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRoutes = require("../routes/authRoutes");
const authMiddleware = require('../middlewares/authMiddleware');
const User = require("../models/userModel");
require('dotenv').config();
const app = express();

app.use(bodyParser.json());

app.use("/api", authRoutes);

// mock the userModel
jest.mock("../models/userModel");


// mock the authMiddleware
jest.mock("../middlewares/authMiddleware" , ()=> {
  jest.fn((req,res,next)=>{
    next();
  })
});


describe("Auth controller", (done) => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll(() => {
    server.close(done);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  // Test for Register functonality
  it("should a register a new user", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, []);
    });

    User.create.mockImplementation((user, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app).post("/api/register").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User Successfully Registered");
  });


  // Test for login functionalities
  it("should login a user and return a token", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    };

    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, [user]);
    });

    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });


  // Test for user details
  it("should return 400 if email or password is missing", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please Provide email and password");
  });


  // Test for invalid email
  it("should return 400 if email does not exist", async () => {
    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  // Test for password incorrect
  it("should return 400 if password is incorrect", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    };

    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, [user]);
    });

    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

});

  // Test for profile routes

  describe('Profile routes' , (done)=>{
    let server;

    beforeAll(()=>{
      server = app.listen(4000)
    });

    afterAll(()=>{
      server.close(done);
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should return profile and authenticate token' , async()=>{
      const user = {
        id : 1,
        username : "testuser",
        email : "test@example.com",
      };

      authMiddleware.mockImplementation((req,res,next)=>{
        req.user = user;
        next();
      });

      User.findById.mockImplementation((id,callback)=>{
        callback(null , [user]);
      });

      const token  = jwt.sign({id:user.id} , process.env.JWT_SECRET_KEY , {expiresIn : '1h'});

      const response = await request(app)
      .get('/api/profile')
      .set('Authorization' , `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id : user.id,
        username : user.username,
        email : user.email
      });

    });



  });

