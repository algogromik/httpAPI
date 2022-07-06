# Launching

### Kill ports (in case of previous error in the emulator) and then simple run emulator

If the emulator has stopped due to an error you have to kill all used ports

```bash
$ kill-port --port 8000,9099,5001,8080,9000,5000,8085,9199,4000,4400,4500 && firebase emulators:start
```

### Backup import/export data in emulator

## Import data in emulator

Add production data in the backup file at:

.../httpAPI/emulators.backup/database_export/functions-api-162ea.json

Then start with importing it:

```bash
$ kill-port --port 8000,9099,5001,8080,9000,5000,8085,9199,4000,4400,4500 && firebase emulators:start --import=./emulators.backup
```

## Export data from emulator

If you want to updates the data with the last changes from the emulator, you have to open a new terminal and run the next command before stoping it:

```bash
$ firebase emulators:export ./emulators.backup
```

Then, you will be able to overwrite past backup

### Tunneling Network

### with ngrok

#### Tunneling firebase cloud functions (on http://localhost:5001/)

```bash
$ ngrok http 5001
```

then you will receive a key (like 77ea-2a0d-6fc2-48c0-4300-3d82-8127-670a-b48f) and you can consume the api on:

https://77ea-2a0d-6fc2-48c0-4300-3d82-8127-670a-b48f.ngrok.io/functions-api-162ea/us-central1/api_express/{function_name}

### with LocalTunnel (currently not available)

#### Tunneling emulator (on http://localhost:4000/)

```bash
$ lt --port 4000 --subdomain emulator-root
```

url: https://emulator-root.loca.lt

#### Tunneling firebase cloud functions (on http://localhost:5001/)

```bash
$ lt --port 5001 --subdomain cloud-functions
```

base-url: https://cloud-functions.loca.lt
project's pathname: /functions-api-162ea/us-central1/{function_name}

example: https://cloud-functions.loca.lt/functions-api-162ea/us-central1/api_express

# Testing scripts:

## Get odds for a sport

{base_URL}/functions-api-162ea/us-central1/api_express/?sport=soccer

### Get an event's odds

{base_URL}/functions-api-162ea/us-central1/api_express/?sport=soccer&eventID=1000
