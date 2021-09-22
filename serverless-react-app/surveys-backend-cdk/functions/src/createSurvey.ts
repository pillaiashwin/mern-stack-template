import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import apiResponses from "./utils/apiResponses";

const TABLE_NAME = process.env.TABLE_NAME || "";

const documentClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return apiResponses._400({ error: "invalid request, you are missing the parameter body" });
  }

  const data = typeof event.body === "object" ? event.body : JSON.parse(event.body);
  
  const survey = {
    id: data.id,
    userId: data.userId,
    createdAt: data.createdAt,
    data: data.data
  }

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: survey
  };

  try {
    await documentClient.put(params).promise();
    return apiResponses._201({ ...survey });
  } catch (dbError) {
    return apiResponses._500({ error: dbError });
  }
};