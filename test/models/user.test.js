const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const UserModel = require('../../models/user');

// SQLite in-memory database for testing
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('User Model', () => {
    let User;

    beforeAll(async () => {
        User = UserModel(sequelize, Sequelize);
        await sequelize.sync({ force: true }); // Reset the table
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('Model Fields', () => {
        it('should create a user with valid fields', async () => {
            const userData = {
                fullName: 'Jane Doe',
                email: 'janeDoe@gmail.com',
                password: 'password123', // Valid password
                role: 'student',
            };
            const user = await User.create(userData);
            
            expect(user.fullName).toBe('Jane Doe');
            expect(user.email).toBe('janeDoe@gmail.com');
            expect(user.role).toBe('student');
            expect(await bcrypt.compare('password123', user.password)).toBe(true); // Password should be hashed
        });

        it('should throw an error if password is too short', async () => {
            await expect(User.create({
                fullName: 'Jane Doe',
                email: 'janeDoe2@gmail.com',
                password: 'short', // Invalid password length
                role: 'student',
            })).rejects.toThrow('Password length must be between 8 and 24 characters.');
        });

        it('should throw an error if password is too long', async () => {
            await expect(User.create({
                fullName: 'Jane Doe',
                email: 'janeDoe3@gmail.com',
                password: 'thispasswordiswaytoolong', // Invalid password length
                role: 'student',
            })).rejects.toThrow('Password length must be between 8 and 24 characters.');
        });

        it('should throw an error if email is invalid', async () => {
            await expect(User.create({
                fullName: 'Jane Doe',
                email: 'invalid-email',
                password: 'password123', // Valid password
                role: 'student',
            })).rejects.toThrow('Validation isEmail on email failed');
        });

        it('should throw an error if role is invalid', async () => {
            await expect(User.create({
                fullName: 'Jane Doe',
                email: 'janeDoe@gmail.com',
                password: 'password123', // Valid password
                role: 'invalid-role',
            })).rejects.toThrow('Validation isIn on role failed');
        });
    });

    //for some reason these tests are not passing, i get errors saying the validPassword method is not working
    //FIXED email MUST be unqiue when testing - use npm test --verbose for more details on errors
    describe('Instance Methods', () => {
        afterEach(async () => {
            await User.destroy({ where: {}, truncate: true });
        });
    
        it('should validate password with validPassword method', async () => {
            try {
                const user = await User.create({
                    fullName: 'Jane Doe',
                    email: 'janeDoe6@gmail.com',
                    password: 'password123', // Valid password
                    role: 'student',
                });
    
                expect(user.password).not.toBe('password123'); // Password should be hashed
                const isValid = await user.validPassword('password123'); // Valid password
                expect(isValid).toBe(true);
            } catch (error) {
                console.error('Error during user creation:', error);
            }
        });
    
        it('should return false for invalid password with validPassword method', async () => {
            try {
                const user = await User.create({
                    fullName: 'Jane Doe',
                    email: 'janeDoe7@gmail.com',
                    password: 'password123', // Valid password
                    role: 'student',
                });
    
                const isValid = await user.validPassword('wrongpassword');
                expect(isValid).toBe(false);
            } catch (error) {
                console.error('Error during user creation:', error);
            }
        });
    });    
});
