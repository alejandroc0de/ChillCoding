import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const s3Client = new S3Client({ region: process.env.AWS_REGION });

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// EL SDK si no ve las credenciales las busca en el .env 
// Envolvemos el dbbClient en el cliente de dynamo que usa los docs para tener sintaxis mas facil y lo exportamos como el s3
