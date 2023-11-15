# OCM Attestation Manager

## Description
<hr/>

The Attestation Manager is the microservice responsible for handling the features related to Issuance of Credentials. It handles REST endpoints for Schemas, Credential Definitions and Verifiable Credentials.

## Usage
<hr/>

###  Swagger Documentation: 

[Swagger/OpenAPI](swagger.json)

## Installation
<hr/>

### Pre-requisite

* pnpm
* docker
* docker-compose
* PostgreSQL

### OCM Services Dependencies

* SSI Abstraction
* Connection Manager

## Running the app

**Each service in the Organizational Credential Manager can be run from the infrastructure repository with Docker.**

**The .env files are in the infrastructure repository under /env**

```bash
    ## production in:
      ./deployment/ci
    ## development in:
      ./deployment/dev
```

* (optional) Edit docker-compose.yml in "infrastructure" to use either **/ci/** or **/dev/** Dockerfiles.

* Run while in **"infrastructure"** project:
```bash
$ docker-compose up --build attestation-m
```
to run only Attestation Manager or
```bash
$ docker-compose up --build
```
to run all the services.

## Build
```
pnpm build
```

## Run
```
pnpm start
```

### Environment Variables Required
```
1. PORT
2. DATABASE_URL
3. ECSURL
4. NATS_URL
5. AGENT_URL
```

### Outgoing communication services
```
1. SSI Abstraction
```

### Incomming communication services
```
1. Principal Manager
```

### Features supported
```
1. Create Schema
2. Create Credential Definition
3. Offer Credentials
4. Propose Credentials
5. Accept Credential
```


## Test
<hr/>

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```


## GDPR
<hr/>

[GDPR](GDPR.md)

## Dependencies
<hr/>

[Dependencies](package.json)

## License
<hr/>

[Apache 2.0 license](LICENSE)
