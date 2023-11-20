# GDPR Compliance Document

The objective of this document is to detail, the data being stored and proccessed by the Organization Credential Manager's, SSI Abstraction Services.

## What information is stored

### Source User Information

- Verifiable Credential Specific Information - The various VC's issued by the particular OCM.
- Proof Presentation Specific Information - Credential Claims.

### Technical User Information (Public)

- Connection Information - The list of connections with different PCM and OCM agents and Pairwise DID.
- Schema information (public)
- Credential/credential definition ids and states
- DID of issuer
- DID of holder
- Created/updated dates

## How is the information stored

### Source User Information

User specific Source User Information is encrypted using the Private Key of the Organizations SSI Agent and stored until the issuance of credential in Organization's SSI Agent's PostgreSQL database.

### Technical User Information (Public)

Technical User Information is encrypted using the Private Key of the Organizations SSI Agent and stored internally (on the agent) on PostgreSQL.

## Who can access the information

The Source User Information and Technical User Information both are accessible only by the Organization specific SSI agent's private key.

## How long will the information stay

The Source User Information and Technical User Information is never wiped out unless the Agent Database is cleared.
