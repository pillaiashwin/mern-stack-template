import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import apiResponses from "./utils/apiResponses";

const TABLE_NAME = process.env.TABLE_NAME || "";

const documentClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = event.pathParameters?.userId || "";

  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues : {
        ':userId': userId
    }
  };

  try {
    const response = await documentClient.query(params).promise();
    return apiResponses._200({ ...response.Items });
  } catch (dbError) {
    return apiResponses._500({ error: dbError });
  }
};