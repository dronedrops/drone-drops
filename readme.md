# Drone-Drops Node Based Solution

## Installation & Pre-requisites

### 1. Installation

```bash
npm install
```

### 2. Run MongoDB

```bash
sudo mongod
```

### 3. Run TestRPC

```bash
testrpc
```

### 4. Run Application


### Running testrpc and mongodb as docker container
```bash
cd deploy
docker-compose up
```


### Stopping testrpc and mongodb as docker container
```bash
cd deploy
docker-compose stop
```


### 1. Installation

```bash
npm run dev
```



## Sample Data

To load sample data, run the following command in your terminal:

```bash
npm run sample
```

If you have previously loaded in this data, you can wipe your database 100% clean with:

```bash
npm run blowitallaway
```

## FAQ

### The Google Maps API key isn't working

You might have hit a limit with the API key — if this is the case you need to sign up for your own API key over at <https://developers.google.com/maps/documentation/javascript/usage>. 
You will need to enable static maps for your API key.

Once you have the API key, simply place it in your `variables.env` file and restart.

### Order of Longitude & Lattitude
We follow mongo's convention in this project.
```
let mongodb = Long & Lat;
let restOfTheWorld = Lat & Long;
```
### I'm getting errors related to `/data/db` like `code:100` and `connection failed`

Check out [this answer](https://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder#answer-7948986) on stack overflow to get mongoDB running locally.

## I'm getting a `URIError: URI malformed` error when running `npm start`

> If you’re getting a `URIError: URI malformed` error when running `npm start`, break out your environment variables. Go into `variables.env` and split the URI like this `MONGO_URI=mongodb://host.com:port` `DB_USER=username` and `DB_PASS=password`. Then inside your `start.js` replace `mongoose.connect(process.env.DATABASE)` with `mongoose.connect(process.env.MONGO_URI, {user: process.env.DB_USER, pass: process.env.DB_PASS});`. I had issues connecting to my mongodb because my password contained symbols.


## ToDo

### thiru
- [X] Mambo Orchestration
- [X] Node App - Meta Coin
- [X] Node App - Meta Mask Integration
- [X] Search Drone based on co-ords
- [] Mambo Grabber & Cannon Control through JS
- [] Lego Doors - Construction
- [] Lego Door - Motor/Pulley Control through JS
- [] BLE - Authentication
- [] Rpi - Scanning Program
- [] RPi - BLE Setup
- [] RPi - Node-program to `updateDelivery` & `validateOrder` Tasks
    - Option 3. MacBook -> Node API -> TestRPC
    - Option 2. RPi -> Node API -> TestRPC
    - Option 1. RPi - > TestRPC
    - Dependency
        - Resolve TestRPC connectivity among all devices. 
        - Run in same network or (AWS Test RPC + Heroku NodeAPI)
- [] 💄 Toast Messages.
- [] 💄 Floating - Labels
- [] Pagewise UX/UI Check. 
- [] SVG Icons Updates
- [] Landing Page - UI Update + Product Features + Team Photo
- [] MongoDB - Schema Update to include additional Details of Drone, (`DroneEthAccount, FlightHours, GpsBuiltIn, CameraFacility`)
- [] Clear unused npm packages from packages.json
- [] Host the node-app & mongo-api in Heroku/Now
- [] Add Everis/Barcelona location based drones to MongoDB Stub Data
- [] Slide Diagrams
- [] Slide Animations + GIF with - gowtham

### jerome + dinesh
- [X] Transaction Contracts - Init
- [] Escrow Management
- [>] API Calls to trigger Drone Fly. 🎫 Revisit with proper orchestration.
- [] Run TestRPC with Stubbed accounts.
- [] Map TestRpc accounts with DroneMongoDB.
- [] Negative scenario - Contract
- [] Elite + BLE Integration
- [] Elite + GPS Integration
- [] Add Pickup Point co-ords to confirm pay page
- [] Happy Day Flow `placeOrder` integration with NodeAPI


### gowtham & Team
- [] Host - AWS Test RPC + Integration
- [] Test - E2E Integration
- [] Arch & Tech Diagram - Draft
- [] Possibility of Google Actions or Alexa Skill to open door.
