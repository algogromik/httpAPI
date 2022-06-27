# Launching

## Kill ports (in case of previous error in the emulator) and then run emulator

```bash
$ kill-port --port 8000,9099,5001,8080,9000,5000,8085,9199,4000,4400,4500 && firebase emulators:start
```

## Tunneling Network

### with ngrok

#### Tunneling firebase cloud functions (on http://localhost:5001/)

```bash
$ ngrok http 5001
```

then you will receive a key (like 77ea-2a0d-6fc2-48c0-4300-3d82-8127-670a-b48f) and you can consume the api on:

https://77ea-2a0d-6fc2-48c0-4300-3d82-8127-670a-b48f.ngrok.io/functions-learning-77e34/us-central1/api_express/{function_name}

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
project's pathname: /functions-learning-77e34/us-central1/{function_name}

example: https://cloud-functions.loca.lt/functions-learning-77e34/us-central1/api_express

# Testing scripts:

### Init database with few data

{base_URL}/functions-learning-77e34/us-central1/api_express/init

### Get odds for a sport

{base_URL}/functions-learning-77e34/us-central1/api_express/?sport=soccer

### Get an event's odds

{base_URL}/functions-learning-77e34/us-central1/api_express/?sport=soccer&eventID=1000
