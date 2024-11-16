const Sequelize = require('sequelize');
const RosterModel = require('../../models/roster');
const UserModel = require('../../models/user');
const CourseModel = require('../../models/course');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

// SQLite in-memory database for testing
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('Roster Model', () => {
    let Roster, User, Course;

    beforeAll(async () => {
        // Initialize models
        User = UserModel(sequelize, Sequelize);
        Course = CourseModel(sequelize, Sequelize);
        Roster = RosterModel(sequelize, Sequelize);

        // Sync all models (reset tables)
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Close the database connection after tests
        await sequelize.close();
    });

    describe('Model Fields', () => {
        it('should create a roster entry with valid fields', async () => {
            // Generate unique IDs for user and course
            const userId = uuidv4();
            const courseId = uuidv4();

            // Create a sample user and course first
            const user = await User.create({
                id: userId,
                fullName: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'student',
            });
            const course = await Course.create({
                id: courseId,
                courseName: 'Test Course',
                courseSemester: 'Spring 2025',
                instructorId: 'John Doe',
                studentAccessCode: 'testCode1',
                iaAccessCode: 'testCode2',
            });

            // Create the roster entry
            const roster = await Roster.create({
                userId: user.id,
                courseId: course.id,
                role: 'student',
            });

            // Check that the roster entry was created correctly
            expect(roster.userId).toBe(user.id);
            expect(roster.courseId).toBe(course.id);
            expect(roster.role).toBe('student');
        });

        it('should throw an error for invalid role', async () => {
          // Generate unique IDs for user and course
          const userId = uuidv4();
          const courseId = uuidv4();
      
          // Create a sample user and course first
          const user = await User.create({
              id: userId,
              fullName: 'Jane Doe',
              email: 'jane@example.com',
              password: 'password123',
              role: 'student',
          });
          const course = await Course.create({
              id: courseId,
              courseName: 'Test Course',
              courseSemester: 'Spring 2025',
              instructorId: 'Jane Doe',
              studentAccessCode: 'testCode3',
              iaAccessCode: 'testCode4',
          });
      
          // Create the roster entry and validate explicitly
          try {
              const roster = Roster.build({
                  userId: user.id,
                  courseId: course.id,
                  role: 'teacher', // Invalid role
              });
              
              // Explicitly trigger validation before saving
              await roster.validate();
      
              // If validation passes, fail the test because validation should fail
              throw new Error('Validation should have failed for invalid role');
          } catch (error) {
              // Ensure it's a SequelizeValidationError
              expect(error.name).toBe('SequelizeValidationError');
      
              // Check for the specific validation error message
              const errorMessages = error.errors.map(e => e.message);
              console.log('Validation Error Messages:', errorMessages);
      
              // Assert that the role validation error is present
              expect(errorMessages).toContain('Validation isIn on role failed');
          }
      });          

      it('should throw an error for missing userId or courseId', async () => {
          // Generate unique IDs for course
          const courseId = uuidv4();

          await expect(Roster.create({
              userId: null,  // Missing userId
              courseId: courseId,
              role: 'student',
          })).rejects.toThrow();

          await expect(Roster.create({
              userId: uuidv4(),  // New unique userId
              courseId: null,  // Missing courseId
              role: 'student',
          })).rejects.toThrow();
      });
      
      it('should not allow duplicate user and course combination', async () => {
        const userId = uuidv4();
        const courseId = uuidv4();
    
        const user = await User.create({
            id: userId,
            fullName: 'Alice Smith',
            email: 'alice@example.com',
            password: 'password123',
            role: 'student',
        });
    
        const course = await Course.create({
            id: courseId,
            courseName: 'Test Course',
            courseSemester: 'Spring 2025',
            instructorId: 'Alice Smith',
            studentAccessCode: 'testCode5',
            iaAccessCode: 'testCode6',
        });
    
        // First entry should pass
        await Roster.create({
            userId: user.id,
            courseId: course.id,
            role: 'student',
        });
    
        // Second entry should fail due to unique constraint
        await expect(Roster.create({
            userId: user.id,
            courseId: course.id,
            role: 'student',
        })).rejects.toThrowError();
    });
    
  });
});
