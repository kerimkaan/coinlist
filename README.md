# Coinlist

It is a serverless function and API for a list of coins that are available on the [Coingecko API](https://api.coingecko.com/api/v3/coins/list).

## Flow

It is get coin list from DynamoDB firstly, if not exist, get coin list from Coingecko API and save to DynamoDB.
After that, it is get coin list from DynamoDB and return it. Then, the result is cached in CloudFront.

## API

Base URL:

```bash
https://coin-list.kerimkaan.com
```

### GET /list

Get coin list.

#### Response

Success: (HTTP status code: 200)

```json
{
    "success": true,
    "coins": [...]
}
```

An example object of coins array:

```json
{
   "id": "tezos",
   "name": "Tezos",
   "symbol": "xtz"
}
```

Error: (HTTP status code: 500)

```json
{
    "success": false,
    "message": "Internal Server Error",
    "error": {}
}
```
