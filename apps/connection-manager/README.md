# OCM Connection Manager

## Description
<hr/>

The connection manager is the microservice responsible for handling the features related to connection between aries agents.  
The service implements REST endpoints, events and calls to other services related to connections in the Organizational Credential Manager.

#### Security note
`Man in the mid` security concern will be address in Phase II of of the project. It was discussed multiple times, and one of the options is to use [TRAIN API](https://train.trust-scheme.de/info/) . 


## Usage
<hr/>


###  Swagger Documentation: 

[Swagger/OpenAPI](swagger.json)

## Installation
<hr/>


### Pre-requisites
* pnpm 
* docker
* docker-compose
* postgres
* NATS Server


### OCM Services Dependencies
* SSI Abstraction
* Principal Manager
* Attestation Manager
* Proof Manager


## Running the app
<hr/>


**Each service in the Organizational Credential Manager can be run from the infrastructure repository with Docker.**

**The .env files are in the infrastructure repository under /env**

```bash
    ## production:
      ./deployment/ci
    ## development:
      ./deployment/dev
```

* (optional) Edit docker-compose.yml in "infrastructure" to use either **/ci/** or **/dev/** Dockerfiles.

* Run while in **"infrastructure"** project:
```bash
$ docker-compose up --build conn-m
```
to run only Connection Manager or
```bash
$ docker-compose up --build
```
to run all the services.


### Environment variables required
```
1. PORT
2. DATABASE_URL
3. NATS_URL
4. AGENT_URL
```

### Outgoing communication services
```
1. PRINCIPAL MANAGER
2. ATTESTATION MANAGER
3. PROOF MANAGER
```

### Incoming communication services
```
1. SSI-ABSTRACTION
2. PROOF MANAGER
3. ATTESTATION MANAGER
```

### Supported features
```
1. Nats endpoint to update connection status
2. Create invitation URL.
3. Provide connection information.
4. Provide a list of connections.
5. Nats endpoint to get connection by ID.
6. Nats endpoint to make connection trusted.
7. Accept connection invitation.
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


