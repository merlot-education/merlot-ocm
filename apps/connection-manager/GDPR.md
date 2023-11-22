# GDPR Compliance Document

The objective of this document is to detail, the data being stored and proccessed by the Organization Credential Manager's, Connection Manger.

## What information is stored

### Source User Information

The email id received from the user.

### Technical User Information (Public)

- DID of the OCM agent
- DID of the other participant in the connection
- Connection Status
- Connection Internal Ids
- Date created and updated
- Holder email as well as wallet name is stored in DB

## How is the information stored

The Source User Information and Technical User Information is encrypted using the Private Key of the Organizations SSI Agent and stored internally (on the agent) on PostgreSQL and externally/ metadata (shared between the OCM services) on PostgreSQL of Organization.

## Who can access the information

The Source User Information and Technical User Information both are accessible only by the Organization specific SSI agent's private key.

## How long will the information stay

The Source User Information and Technical User Information is wiped out according to the retention periods (not defined yet).
