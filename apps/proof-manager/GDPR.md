# GDPR Compliance Document

The objective of this document is to detail, the data being stored and proccessed by the Organization Credential Manager's, Proof Manger.

## What information is stored

### Source User Information

No personal data is accessed or processed

### Technical User Information (Public)

Schema id
Presentation ids and states
DID of requester
Created/updated dates

## How is the information stored

The Technical User Information is encrypted using the Private Key of the Organizations SSI Agent and stored internally (on the agent) on PostgreSQL and externally/ metadata (shared between the OCM services) on PostgreSQL of Organization.

## Who can access the information

The Technical User Information both are accessible only by the Organization specific SSI agent's private key.

## How long will the information stay

The Technical User Information is wiped out according to the retention periods (not defined yet).
