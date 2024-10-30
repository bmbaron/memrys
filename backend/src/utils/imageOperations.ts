import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import 'dotenv/config';

const client = new S3Client({
  region: process.env.AWS_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});
export const uploadToS3 = async (userID: string, file: any) => {
  if (!file || !file.buffer) {
    return null;
  }

  //this will be the filename in the bucket
  const objectKey = `${userID}/${Date.now()}.jpg`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET ?? '',
    Key: objectKey,
    Body: file.buffer,
    ContentType: 'image/jpeg'
  };

  const upload = new Upload({
    client,
    params
  });

  try {
    upload.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });
    await upload.done();
    //if successful, return with the key to store in the DB
    return objectKey
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Upload failed');
  }
};
export const getImageFromS3 = async (objectKey: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_THUMBNAIL_BUCKET ?? '',
      Key: objectKey,
    });
    const url = await getSignedUrl(client, command, { expiresIn: 300 }); // URL expires in 5 minutes
    // res.json({ url });
    return url
  } catch (err) {
      console.error("Error", err);
  }
}




