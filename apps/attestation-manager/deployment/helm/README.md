# attestation-manager

![Version: 1.0.1](https://img.shields.io/badge/Version-1.0.1-informational?style=flat-square) ![AppVersion: v1.0.1-rc](https://img.shields.io/badge/AppVersion-v1.0.1--rc-informational?style=flat-square)

attestation-manager deployment

## Values

| Key                                                               | Type   | Default                                                 | Description                                                    |
| ----------------------------------------------------------------- | ------ | ------------------------------------------------------- | -------------------------------------------------------------- |
| attestationManager.acceptMembershipCredentialsConfig              | string | `"AUTO"`                                                |                                                                |
| attestationManager.agent.host                                     | string | `"ssi-abstraction"`                                     |                                                                |
| attestationManager.agent.port                                     | int    | `3010`                                                  |                                                                |
| attestationManager.agent.protocol                                 | string | `"http"`                                                |                                                                |
| attestationManager.database.db                                    | string | `"ocm_attestation_manager"`                             |                                                                |
| attestationManager.database.host                                  | string | `"postgresql-postgresql-ha-postgresql.infra"`           |                                                                |
| attestationManager.database.password                              | string | `"ocm_attestation_manager"`                             |                                                                |
| attestationManager.database.port                                  | int    | `5432`                                                  |                                                                |
| attestationManager.database.schema                                | string | `"attestation"`                                         |                                                                |
| attestationManager.database.user                                  | string | `"ocm_attestation_manager"`                             |                                                                |
| attestationManager.elastic.port                                   | int    | `9200`                                                  |                                                                |
| attestationManager.elastic.protocol                               | string | `"http"`                                                |                                                                |
| attestationManager.elastic.url                                    | string | `"elasticsearch"`                                       |                                                                |
| attestationManager.nats.port                                      | int    | `4222`                                                  |                                                                |
| attestationManager.nats.protocol                                  | string | `"nats"`                                                |                                                                |
| attestationManager.nats.url                                       | string | `"nats"`                                                |                                                                |
| attestationManager.url.attestationManager                         | string | `"https://gaiax.vereign.com/ocm/attestation"`           |                                                                |
| attestationManager.url.connectionManager                          | string | `"https://gaiax.vereign.com/ocm/connection"`            |                                                                |
| attestationManager.url.tsa                                        | string | `"https://gaiax.vereign.com/tsa/policy/policy/example"` |                                                                |
| autoscaling.enabled                                               | bool   | `false`                                                 | Enable autoscaling                                             |
| autoscaling.maxReplicas                                           | int    | `3`                                                     | Maximum replicas                                               |
| autoscaling.minReplicas                                           | int    | `1`                                                     | Minimum replicas                                               |
| autoscaling.targetCPUUtilizationPercentage                        | int    | `70`                                                    | CPU target for autoscaling trigger                             |
| autoscaling.targetMemoryUtilizationPercentage                     | int    | `70`                                                    | Memory target for autoscaling trigger                          |
| image.name                                                        | string | `"gaiax/attestation-manager"`                           | Image name                                                     |
| image.pullPolicy                                                  | string | `"IfNotPresent"`                                        | Image pull policy                                              |
| image.pullSecrets                                                 | string | `"deployment-key-light"`                                | Image pull secret when internal image is used                  |
| image.repository                                                  | string | `"eu.gcr.io/vrgn-infra-prj"`                            |                                                                |
| image.sha                                                         | string | `""`                                                    | Image sha, usually generated by the CI Uses image.tag if empty |
| image.tag                                                         | string | `""`                                                    | Image tag Uses .Chart.AppVersion if empty                      |
| ingress.annotations."cert-manager.io/cluster-issuer"              | string | `"letsencrypt-production-http"`                         |                                                                |
| ingress.annotations."kubernetes.io/ingress.class"                 | string | `"nginx"`                                               |                                                                |
| ingress.annotations."kubernetes.io/ingress.global-static-ip-name" | string | `"dev-light-public"`                                    |                                                                |
| ingress.annotations."nginx.ingress.kubernetes.io/rewrite-target"  | string | `"/$2"`                                                 |                                                                |
| ingress.enabled                                                   | bool   | `true`                                                  |                                                                |
| ingress.frontendDomain                                            | string | `"gaiax.vereign.com"`                                   |                                                                |
| ingress.frontendTlsSecretName                                     | string | `"cert-manager-tls"`                                    |                                                                |
| ingress.tlsEnabled                                                | bool   | `true`                                                  |                                                                |
| log.encoding                                                      | string | `"json"`                                                |                                                                |
| log.level                                                         | string | `"INFO"`                                                |                                                                |
| metrics.enabled                                                   | bool   | `true`                                                  | Enable prometheus metrics                                      |
| metrics.port                                                      | int    | `2112`                                                  | Port for prometheus metrics                                    |
| name                                                              | string | `"ssi-abstraction"`                                     | Application name                                               |
| nameOverride                                                      | string | `""`                                                    | Ovverwrites application name                                   |
| podAnnotations                                                    | object | `{}`                                                    |                                                                |
| replicaCount                                                      | int    | `1`                                                     | Default number of instances to start                           |
| resources.limits.cpu                                              | string | `"150m"`                                                |                                                                |
| resources.limits.memory                                           | string | `"128Mi"`                                               |                                                                |
| resources.requests.cpu                                            | string | `"25m"`                                                 |                                                                |
| resources.requests.memory                                         | string | `"64Mi"`                                                |                                                                |
| security.runAsGid                                                 | int    | `0`                                                     | Group used by the apps                                         |
| security.runAsNonRoot                                             | bool   | `false`                                                 | by default, apps run as non-root                               |
| security.runAsUid                                                 | int    | `0`                                                     | User used by the apps                                          |
| service.port                                                      | int    | `3005`                                                  |                                                                |

---

Autogenerated from chart metadata using [helm-docs v1.10.0](https://github.com/norwoodj/helm-docs/releases/v1.10.0)
