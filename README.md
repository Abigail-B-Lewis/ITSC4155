# ITSC4155
Repository for ITSC 4155-001 group project.

# Required software
- mysql workbench
- mysql
- node js

# SETUP
- run npm i to install all node modules
- To connect to the database, navigate to the models folder, then index.js
- in index.js, add password
- navigate to SQL folder, then to init.txt
- Copy the text and paste it into your MySQL workbench, then run the code

DROP DATABASE IF EXISTS officeq;
CREATE DATABASE officeq;
use officeq;


# SETUP part 2
- if testing, first run nodemon app to create models in your database
- Then, paste the code from SQL/mockdata into your MySQL workbench and run. This will add mockdata to your local database instance (we don't have this yet!)

# Pushing to Git
- Before pushing to git, make sure to delete the node_modules folder

