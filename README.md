## Gettings Started

This app is written in Next.js using JavaScript

### Requisites

- [Git][git] v2.43 or greater
- [Npm][npm] v10.2 or greater
- [Node.js][node] 21+ or greater

## Project Setup

To run the project, you need to have installed Node.js, Npm

To verify that you have all the required tools installed, run the following commands in your terminal:

node --version
npm --version

The next step is to install npm packages with the command:

npm install


[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/


### MongoDB Setup

This project requires MongoDB. You can:

Install MongoDB locally from [MongoDB.com](https://www.mongodb.com/try/download/community)

Create a .env.local file in the project root with:
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=test-db

Finally, after the installation of the packages is finished, you can run the app with the following command:

npm run dev

App will be up and running on http://localhost:3000