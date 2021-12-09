const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: "us-east-1" });

exports.handler = async event => {
    const putParams = {
        TableName: "clients",
        Item: {
            connectionId: event.requestContext.connectionId,
            ttl:  parseInt((Date.now() / 1000) + 3600) // unix epoch in seconds -- this is 1 hour
        }
    };

    try {
        await ddb.put(putParams).promise();
    } catch (err) {
        return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }

    return { statusCode: 200, body: 'Connected.' };
};
