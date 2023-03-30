# Coinlist

It is a simple serverless function and API for a list of coins that are available on the [Coingecko API](https://api.coingecko.com/api/v3/coins/list).

## Flow

It is get coin list from DynamoDB firstly, if not exist, get coin list from Coingecko API and save to DynamoDB.
After that, it is get coin list from DynamoDB and return it. Then, the result is cached in CloudFront.

## Stack

- [AWS Lambda](https://aws.amazon.com/lambda/) - compute
- [AWS API Gateway](https://aws.amazon.com/api-gateway/) - API
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/) - database
- [AWS CloudFront](https://aws.amazon.com/cloudfront/) - CDN
- [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/) - monitoring and logging

For deployment, just used AWS CLI.

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
