const Sequelize = require('sequelize');
const CourseModel = require('../../models/course');

// SQLite in-memory database for testing
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('Course Model', () => {
    let Course;

    beforeAll(async () => {
        Course = CourseModel(sequelize, Sequelize);
        await sequelize.sync({ force: true }); // Reset the table
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('Model Fields', () => {
        it('should create a course with valid fields', async () => {
            const course = await Course.create({
                courseName: 'Test Course',
                courseSemester: 'Spring 2025',
                studentAccessCode: 'testCode1',
                iaAccessCode: 'testCode2',
            });

            expect(course.courseName).toBe('Test Course');
            expect(course.courseSemester).toBe('Spring 2025');
            expect(course.studentAccessCode).toBe('testCode1');
            expect(course.iaAccessCode).toBe('testCode2');
        });

        it('should throw an error for invalid course semester', async () => {
            await expect(Course.create({
                courseName: 'Test Course',
                courseSemester: 'Fall',  // Invalid semester
                studentAccessCode: 'testCode3',
                iaAccessCode: 'testCode4'
            })).rejects.toThrow();
        });
    });
});
