const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand
} = require("@aws-sdk/lib-dynamodb");
const axios = require("axios");

const region = 'eu-central-1';
const COIN_TABLE = 'coins-table-production';
const dynamodb = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(dynamodb);

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/list';

/**
 * It makes a GET request to the CoinGecko API and returns the data
 * @returns An array of objects.
 */
const getCoinsList = async () => {
    try {
        const { data } = await axios.get(COINGECKO_API_URL);
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.handler = async (event) => {
    console.log("EVENT: ", event);
    try {
        let result;
        const params = {
            TableName: COIN_TABLE,
        };
        // Scan the table to see if there is any data
        const { Items } = await docClient.send(new ScanCommand(params));
        if (Items.length > 0) {
            // If there is data in the database, we return it
            result = {
                success: true,
                coins: Items,
            };
        } else {
            const promises = [];
            // If there is no data in the database, we get it from the API
            // Get the coins list from Coingecko API
            const getFromApi = await getCoinsList();
            /*  if (getFromApi.length > 0) {
                await docClient.send(new BatchWriteCommand(
                    {
                        RequestItems: {
                            [COIN_TABLE]: getFromApi.map(coin => ({
                                PutRequest: {
                                    Item: {
                                        id: coin.id,
                                        symbol: coin.symbol,
                                        name: coin.name,
                                    }
                                }
                        }))
                    }}
                ));
            } */
            if (getFromApi.length > 0) {
                // If we get data from the API, we save it in the database
                for (const coin of getFromApi) {
                    const params = {
                        TableName: COIN_TABLE,
                        Item: {
                            id: coin.id,
                            symbol: coin.symbol,
                            name: coin.name,
                        },
                    };
                    promises.push(docClient.send(new PutCommand(params)));
                }
                await Promise.all(promises);
            }
            result = {
                success: true,
                coins: getFromApi,
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Internal Server Error",
                error,
            }),
        };
    }
};
