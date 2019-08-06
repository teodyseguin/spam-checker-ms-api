# Welcome to Spam Checker Microservice API

### Pre-requisite

1. Docker
2. Docker Compose

### Services

1. `scms-api`: The container that runs the API via Nodejs
2. `scms-spamassassin`: The container that runs the Spamassassin Daemon

### Deployment

1. Change directory to `script` directory: `cd script`
2. Run the deploy script: `./deploy.sh`. The deploy script should pull the images required, and after that create the containers for the services. When it's done, it should output something like this
```
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                    NAMES
24876df5fb15        scms-api_scms-api            "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes        0.0.0.0:3000->3000/tcp   scms-api
4d283e0657eb        teodyseguin/spamassassin   "/entrypoint.sh"         4 minutes ago       Up 4 minutes        0.0.0.0:783->783/tcp     scms-spamassassin
```

### Testing

1. I am using Postman to test the API. If you don't have it yet, you should get it from here https://www.getpostman.com
2. Once you have Postman installed and running, execute a POST request to `http://somedomain.com:3000/v1/api/analyze`
3. Set `Body` -> `raw` -> `application/json`
4. The payload should be like
```
{
  "fromName": "test@email.com",
  "subject": "some subject to pass",
  "body": "some body text to pass"
}
```
5. When the request is a success, you should get a JSON response of something like this
```
{
    "status": "success",
    "result": {
        "score": "6.5",
        "meta": [
            {
                "problemFound": "Refers to an erectile drug",
                "score": "1.778"
            },
            {
                "problemFound": "Informational: message has no Received headers",
                "score": "-0.001"
            },
            {
                "problemFound": "message body is 75-100% uppercase",
                "score": "1.480"
            }
        ],
        "body": [
            {
                "problemFound": "Two or more drugs crammed together into one word",
                "score": "3.300"
            },
            {
                "problemFound": "Mentions an E.D. drug",
                "score": "2.799"
            }
        ],
        "header": [
            {
                "problemFound": "Sender email is commonly abused enduser mail provider",
                "score": "0.001"
            },
            {
                "problemFound": "Informational: message was not relayed via SMTP",
                "score": "-0.001"
            }
        ],
        "rawbody": [
            {
                "problemFound": "Quoted-printable line longer than 76 chars",
                "score": "0.001"
            }
        ]
    },
    "message": "The message is a Spam and is evaluated with 6.5 points in a maximun of 5.0"
}
```

### IMPORTANT

The `REQUIRED_SCORE` being set from here is `5.0`. If ever you need to lower that to make Spamassassin, more aggressive you can modify that from the `docker-compose.yml` file, under the `scms-spamassassin` services.
