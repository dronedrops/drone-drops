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

### 1. Installation

```bash
npm run start
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

### I'm getting errors related to `/data/db` like `code:100` and `connection failed`

Check out [this answer](https://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder#answer-7948986) on stack overflow to get mongoDB running locally.

## I'm getting a `URIError: URI malformed` error when running `npm start`

> If you’re getting a `URIError: URI malformed` error when running `npm start`, break out your environment variables. Go into `variables.env` and split the URI like this `MONGO_URI=mongodb://host.com:port` `DB_USER=username` and `DB_PASS=password`. Then inside your `start.js` replace `mongoose.connect(process.env.DATABASE)` with `mongoose.connect(process.env.MONGO_URI, {user: process.env.DB_USER, pass: process.env.DB_PASS});`. I had issues connecting to my mongodb because my password contained symbols.
