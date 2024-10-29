import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

const client = new S3Client({
  region: process.env.AWS_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});
export const uploadToS3 = async (userID: string, buffer: any) => {
  try {
    //this will be the filename in the bucket
    const objectKey = `${userID}/${Date.now()}.jpg`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET ?? '',
      Key: objectKey,
      Body: buffer,
      ContentType: 'image/jpeg'
    };
    const command = new PutObjectCommand(params);
    await client.send(command);
    //if successful, return with the key to store in the DB
    return objectKey
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Upload failed');
  }
};
export const getImageFromS3 = async (objectKey: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET ?? '',
    Key: objectKey,
  });
  try {
    const response = await client.send(command);
    // TODO
    // use response.Body later to access the file data for streaming or handling
    return response.ETag;
  } catch (err) {
    console.error("Error", err);
  }
}




