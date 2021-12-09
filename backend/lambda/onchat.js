const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: "us-east-1"});

async function who() {
    const params = {
        ProjectionExpression: "connectionId",
        TableName: "clients"
    };
    const data = await ddb.scan(params).promise();
    return data.Items;
}

async function broadcast(event, message) {
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: `https://${event.requestContext.domainName}/prod/`
    });

    const fullMessage = `${event.requestContext.identity.sourceIp}: ${message}`;
    const connectionIds = await who();
    for (const c of connectionIds) {
        const params = {ConnectionId: c.connectionId, Data: JSON.stringify({action: "broadcast", data: fullMessage})};
        await apigwManagementApi.postToConnection(params).promise();
    }
}

exports.handler = async event => {
    console.log("EVENT", JSON.stringify(event, null, 4));
    const body = JSON.parse(event.body);
    const message = body.data.message;

    console.log("incoming message:", message);

    await broadcast(event, message);

    return {statusCode: 200, body: 'Ok.'};
};
