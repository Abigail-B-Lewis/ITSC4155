const Sequelize = require('sequelize');

//TODO: when time permits, set up a config.js or env file to deal with whether you are
//connecting to the test database or dev database.
const sequelize = new Sequelize('officeq_test', 'root', 'ADD PASSWORD HERE', {
  dialect: 'mysql'
});

const Course = require('../../models/course.js')(sequelize, Sequelize);


describe('Course Model', () => {
    beforeAll(async() => {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
    });
    afterAll(async() => {
        await sequelize.close();
    });
    describe('Model Fields', () => {
        it('should create a course with a courseName, courseSemester, instructorName, studentAccessCode, iaAccessCode', async () => {
            const course = Course.build({
                courseName: 'test course',
                courseSemester: 'Fall 2024',
                instructorName: 'John Doe',
                studentAccessCode: 'testCode1',
                iaAccessCode: 'testCode2'
            });

            expect(course.courseName).toBe('test course');
            expect(course.courseSemester).toBe('Fall 2024');
            expect(course.instructorName).toBe('John Doe');
            expect(course.studentAccessCode).toBe('testCode1');
            expect(course.iaAccessCode).toBe('testCode2');
        });

        it('should throw an error for invalid course semester', async() => {
            try{
                const course = Course.build({
                    courseName: 'test course',
                    courseSemester: 'Fall',
                    instructorName: 'John Doe',
                    studentAccessCode: 'testCode1',
                    iaAccessCode: 'testCode2'
                });
            }catch(error){
                expect(error.errors[0].message).toBe('Validation isIn failed on courseSemester failed');
            };
        });
    });
});