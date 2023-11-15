# SSI Abstraction Service
## Description

<hr/>  
  <p align="center">A core service for the Organizational Credential Manager, providing the DIDComm functionality and initializing the agent, wallet and ledger interactions of the whole application.</p>

## Usage
<hr/>

### Endpoint documentation at: 

[Aries REST Extension](swagger.json)

[Full Agent Events](EVENTS-DOCUMENTATION.md)

[Sign and Verify Interface](SIGN-AND-VERIFY.md)

with the default exposed ports: 
* 3010 - Aries REST extension
* 3009 - Sign and Veify interface exposed
* 4000 - didcomm interface


## Installation
<hr/>

Dependencies:
```bash
$ pnpm install 
```

* **If docker is not installed, [Install docker](https://docs.docker.com/engine/install/)**.
  

* **If docker-compose is not installed, [Install docker-compose](https://docs.docker.com/compose/install/)**.

* (optional) Postgres GUI 
https://dbeaver.io/download/

<hr/>


## Running the app
<hr/>

### Environment variables
[.env.example](.env.example)
* PORT is the port for the signing and verification interface
* AFJ_EXT_PORT is the port for the openapi documentation described in [swagger.json](swagger.json)
* AGENT_AUTO_ACCEPT_CONNECTION can be either true or false
* AGENT_AUTO_ACCEPT_CREDENTIAL can be either: always, contentApproved, never
* AGENT_PUBLIC_DID_SEED will generate the did and verkey (32 symbols)
* for security reasons AGENT_WALLET_KEY and AGENT_WALLET_ID should be different
* AGENT_LEDGER_ID can be: ID_UNION,BCOVRIN_TEST,GREEN_LIGHT
  - the three pool transaction genesis are inside the code configuration
  - every ledger can be provided on its own
  - multiple ledgers can also be specified, separated by a comma

* AGENT_ID_UNION_KEY is needed if the ledger of choice is IDUnion


**Each service in the Organizational Credential Manager can be run from the infrastructure repository with Docker.**

**The .env files are in the infrastructure repository under /env**

### There are two separate Dockefiles in "./deployment" of every project:
```bash
    ## production in:
      ./deployment/ci
    ## development in:
      ./deployment/dev
```


* (optional) Edit docker-compose.yml in "infrastructure" to use either **/ci/** or **/dev/** Dockerfiles.

* Run while in **"infrastructure"** project:
```bash
$ docker-compose up --build
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
