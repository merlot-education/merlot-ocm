## Signing and verification interface is accessible on SSI Abstraction

### METHOD: POST

**type: "buffer" is necessary to know internally what transformation needs to be done**

```
:3009/v1/agent/wallet/sign

body : {
  data: [
    {
       type: "buffer",
       dataBase64: base64 string
    },
    verkey: string
  ]
}


```

### Returns

```
{
  statusCode: Number,
  message: string, // The message is the path you followed on the agent object
  data:  base64 string, // signature
}
```

<hr/>
and
<hr/>

### METHOD: POST

```
:3009/v1/agent/wallet/verify

body : {
  data: [
    signerVerkey: string,
    {
      type: "buffer",
      dataBase64: base64 string   //// This is the data to be verified
    },
    {
      type: "buffer",
      dataBase64: base64 string  //// This is the signature
    }
  ]
}
```

### Returns

```
{
  statusCode: Number,
  message: string, // The message is the path you followed on the agent object
  data: boolean // returns validity of signature on the data
}
```

## Get Agent Info endpoint (did, verkey) on SSI Abstraction

### METHOD: GET

```
:3009/v1/agent/info
```

### Returns

```
{
    "statusCode": 200,
    "message": "Success",
    "data": {
        "did": string, // did of the OCM agent
        "verkey": string // verkey needed for signing and verification
    }
}
```
