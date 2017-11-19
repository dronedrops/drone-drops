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
- ✅  Mambo Orchestration
- ✅  Node App - Meta Coin
- ✅  Node App - Meta Mask Integration
- ✅  Search Drone based on co-ords
- ✅  Lego Doors Base Version - Construction
- ✅  Rpi - Image burning - Nodejs installation - BLE Setup
- ✅  SVG Icons Updates
- ✅  RPi - BLE Setup
- ✅  MongoDB - Schema Update to include additional Details of Drone, (`droneId (mambo-0702) , droneEthAccount, FlightHours, GpsBuiltIn, CameraFacility`)
- ✅  Lego Motion Sensor Detection
- ✅ BLE - Authentication
- ✅ Video Animation Done.
- ✅ `LegoController getOpenOrderId() updateOrderStatus()` - req, res
- ❌ Lego Door - Motor/Pulley Control through JS
- ❌ Build Order-Status Page
    - ❌ Build socket.io based API
    - ❌ Add Animated UI to represent status.
- ❌ Rpi - Scanning Program
- ❌ RPi - Node-program to `updateDelivery` & `validateOrder` Tasks
    - ✅  Option 2. MacBook -> Node API -> TestRPC
    - ✅  Option 1. RPi -> Node API -> TestRPC
        - Write a Client.
    - ❌ Dependency
        - ❌ Resolve TestRPC connectivity among all devices. 
        - ❌ Run in same network or (AWS Test RPC + Heroku NodeAPI)
- ❌ Add Everis/Barcelona location based drones to MongoDB Stub Data
- ❌ Pagewise UX/UI Check. 
- ❌ Hi-Res Drone Images
- ❌ Slide Diagrams
- ❌ Slide Animations + GIF with - gowtham
- ❌ Expose ETH Accounts to MongoDB API
- ❌ Landing Page - UI Update + Product Features + Team Photo
- ❌ Search for all TODO: in Repo and close it.
- ❌ Host the node-app & mongo-api in Heroku/Now
- ❌ 💄 Toast Messages.
- ❌ 💄 Floating - Labels
- ❌ Clear unused npm packages from packages.json

### jerome + dinesh + thiru
- ✅  Transaction Contracts - Init
- ❌ Happy Day Flow `placeOrder` integration with NodeAPI
- ✅  API Calls to trigger Drone Fly. 
- ❌ Revisit with proper orchestration.
- ❌ Remove All HardCoded Values
- ❌ Negative scenario - Contract
- ❌ Run TestRPC with Stubbed accounts.
- ❌ Map TestRpc accounts with DroneMongoDB. - Thiru
- ❌ Elite + BLE Integration
- ❌ Escrow Management
- ❌ Add Pickup Point co-ords to confirm pay page - dinesh ???

### gowtham & Team
- ❌ ValidateOrder API
- ❌ Host - AWS Test RPC + Integration - Truffle Migration Issue.
- ❌ Arch & Tech Diagram - Draft
- ❌ Slide preparation
- ❌ Test - E2E Integration
- ❌ Possibility of Google Actions or Alexa Skill to open door.
