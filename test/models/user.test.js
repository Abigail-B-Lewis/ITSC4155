const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

//TODO: when time permits, set up a config.js or env file to deal with whether you are
//connecting to the test database or dev database.
const sequelize = new Sequelize('officeq_test', 'root', 'ADD PASSWORD HERE', {
  dialect: 'mysql'
});

const User = require('../../models/user.js')(sequelize, Sequelize);


describe('User Model', () => {
    beforeAll(async() => {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
    });
    afterAll(async() => {
        await sequelize.close();
    });
    describe('Model Fields', () => {
        it('should create a user with fullName, email, password, and role', async () => {
            const user = User.build({
                fullName: 'Jane Doe',
                email: 'janeDoe@gmail.com',
                password: '123pass',
                role: 'student',
            });

            expect(user.fullName).toBe('Jane Doe');
            expect(user.email).toBe('janeDoe@gmail.com');
            expect(user.password).toBe('123pass');
            expect(user.role).toBe('student');
        });

        it('should throw an error if email is invalid', async () => {
            try {
                const user = User.build({
                    fullName: 'Jane Doe',
                    email: 'invalid-email',
                    password: '123pass',
                    role: 'student',
                });
                await user.validate();
            } catch (error) {
                expect(error.errors[0].message).toBe('Validation isEmail on email failed');
            }
        });

        it('should throw an error if role is not instructor or student', async () => {
            try {
                const user = User.build({
                    fullName: 'Jane Doe',
                    email: 'janeDoe@gmail.com',
                    password: '123pass',
                    role: 'invalid-role',
                });
                await user.validate();
            } catch (error) {
                expect(error.errors[0].message).toBe('Validation isIn on role failed');
            }
        });
    });

    describe('Hooks', () => {
        it('should hash password before validating', async () => {
            const user = User.build({
                fullName: 'Jane Doe',
                email: 'janeDoe@gmail.com',
                password: '123pass',
                role: 'student',
            });
            await user.validate();
            expect(bcrypt.compareSync('123pass', user.password)).toBe(true);  // The password should be hashed
        });
    });

    describe('Instance Methods', () => {
        it('should correctly validate password with validPassword method', async () => {
            const hashedPassword = await bcrypt.hash('123pass', 10);
            const user = User.build({
                fullName: 'Jane Doe',
                email: 'janeDoe@gmail.com',
                password: hashedPassword,
                role: 'student',
            });

            const isValid = await user.validPassword('123pass');
            expect(isValid).toBe(true);
        });

        it('should return false for invalid passwords with validPassword method', async () => {
            const hashedPassword = await bcrypt.hash('123pass', 10);
            const user = User.build({
                fullName: 'Jane Doe',
                email: 'janeDoe@gmail.com',
                password: hashedPassword,
                role: 'student',
            });

            const isValid = await user.validPassword('wrongpassword');
            expect(isValid).toBe(false);
        });
    });
});