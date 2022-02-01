### Shop API
An API for my shopping apps ([react-native](https://github.com/Osama-Khan/react-native-shop), [react-js](https://github.com/Osama-Khan/react-shop)). It was started as a practice project for NestJS.

### Steps before Setup
- Create the database in your DBMS

### Setup
Run the following commands in order to start up a server
- Clone the repo: `git clone https://github.com/Osama-Khan/shop-api`
- CD into the created directory: `cd shop-api`
- Create a copy of .env.example as .env: `cp .env.example .env`
- Add database details (host, port, username, etc.) in the `.env` file
- Install the dependencies: `npm install`
- Seed database ***(optional)***: `npm run seed`
- Start up the server: `npm start`
