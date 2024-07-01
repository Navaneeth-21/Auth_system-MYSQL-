// writing unit test for userModel Functions

const db = require("../config/db");
const User = require("../models/userModel");

// Mock the database query function
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

// writing test suites
describe("User Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for create user
  it("should create a new user", (done) => {
    const user = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { id: 1 });
    });

    User.create(user, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ id: 1 });
      done();
    });
  });

  //   Test for findByEmail
  it("should find a user by email", (done) => {
    const email = "test@example.com"
    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [user]);
    });

    User.findByEmail(email, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([user]);
      done();
    });
  });


// Test for findById
  it("should find a user by ID", (done) => {
    const id = 1;
    const user = {
        id: 1,
        username: "testuser",
        email: "test@example.com"
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [user]);
    });

    User.findById(id, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([user]);
      done();
    });
  });
});
