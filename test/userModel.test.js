// writing unit tests for userModel functions

const db = require("../config/db");
const User = require("../models/userModel");

// mocking the database connection
jest.mock("../config/db", () => {
  query: jest.fn();
});

// Test suites
describe("user model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // testing for create user
  it("should create a new user ", (done) => {
    const user = {
      username: "testuser",
      email: "test@example.com",
      password: "password",
    };
    db.query.mockImplementation((sql, params, callback) =>
      callback(null, { insertId: 1 })
    );

    User.create(user, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ insertId: 1 });
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO users (username , email , password) VALUES (?,?,?)",
        [user.username, user.email, user.password],
        expect.any(Function)
      );
      done();
    });
  });

    //  testing for findbyemail
    it("should find a user by emailid" , (done)=>{
        const email = "test@example.com";
        const user  = {
            id : 1,
            username: "testuser",
            email: "test@example.com",
            password: "password",      
        };
        db.query.mockImplementation((sql,params,callback)=>callback(null,[user]));

        User.findByEmail(email , (err,result)=>{
            expect(err).toBeNull();
            expect(result).toEqual(user);
            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM users WHERE email = ?",
                [email],
                expect.any(Function)
            );
            done();
        });
    });


    // testing for findbyId
    it("should find a user by id" , (done)=>{
        const id = 1;
        const user = {
            id : 1,
            username: "testuser",
            email: "test@example.com",
            password: "password",
        };
        db.query.mockImplementation((sql,params,callback)=>callback(null,[user]));

        User.findById(id , (err,result)=>{
            expect(err).toBeNull();
            expect(result).toEqual(user);
            expect(db.query).toHaveBeenCalledWith(
                "SELECT id, username, email FROM users WHERE id = ?",
                [id],
                expect.any(Function)
            );
            done();
        });
    });

});
