import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';
import pool from '../dbConfig';

const client = new S3Client({
  region: process.env.AWS_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});
export const uploadToS3 = async (userID: string, file: Express.Multer.File) => {
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
    upload.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });
    await upload.done();
    //if successful, return with the key to store in the DB
    return objectKey;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Upload failed');
  }
};
export const getURLsFromS3 = async (objectKey: string) => {
  try {
    const config1 = {
      Bucket: process.env.AWS_S3_THUMBNAIL_BUCKET,
      Key: objectKey
    };
    const config2 = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: objectKey
    };
    // Check if the image exists
    const imageCheck1 = await client.send(new HeadObjectCommand(config1));
    const imageCheck2 = await client.send(new HeadObjectCommand(config2));

    if (!imageCheck1 || !imageCheck2) {
      console.log('not found in s3:', imageCheck1, imageCheck2);
      return;
    }

    // Images exists so can get URLs
    const command1 = new GetObjectCommand(config1);
    const command2 = new GetObjectCommand(config2);

    const urlThumbnail = await getSignedUrl(client, command1, { expiresIn: 300 }); // URL expires in 5 minutes
    const urlMain = await getSignedUrl(client, command2, { expiresIn: 300 }); // URL expires in 5 minutes
    return [urlThumbnail, urlMain];
  } catch (err: unknown) {
    if ((err as Error).name === 'NotFound') {
      console.error('Image does not exist in S3 bucket:', err);
      return null;
    } else {
      console.error('Error retrieving object from S3:', err);
      return null;
    }
  }
};

export const removeImageFromS3 = async (objectKey: string) => {
  const config1 = {
    Bucket: process.env.AWS_S3_THUMBNAIL_BUCKET,
    Key: objectKey
  };
  const config2 = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: objectKey
  };

  // TODO
  // refactor duplicate code
  const imageCheck1 = await client.send(new HeadObjectCommand(config1));
  const imageCheck2 = await client.send(new HeadObjectCommand(config2));

  if (!imageCheck1 || !imageCheck2) {
    console.log('not found in s3:', imageCheck1, imageCheck2);
    return;
  }

  // images exist in both buckets so can proceed to delete
  try {
    const input1 = {
      Bucket: config1.Bucket,
      Key: objectKey
    };
    const input2 = {
      Bucket: config2.Bucket,
      Key: objectKey
    };
    const command1 = new DeleteObjectCommand(input1);
    const command2 = new DeleteObjectCommand(input2);

    await client.send(command1);
    await client.send(command2);

    //if successful, return with the key of the deleted objects
    return objectKey;
  } catch (err) {
    console.error('Error deleting file:', err);
    throw new Error('Delete failed');
  }
};

export const removeOldImage = async (userID: string, date: Date) => {
  const newPool = await pool.connect();

  try {
    const queryGetOldImageKey =
      'SELECT * FROM submissions WHERE user_id = $1::BIGINT AND created_at = $2::DATE';
    const valuesGet = [userID, date];
    const result = await newPool.query(queryGetOldImageKey, valuesGet);
    if (result.rows[0].image_key) {
      console.log('has');
      await removeImageFromS3(result.rows[0].image_key);
      return result.rows[0].image_key;
    } else console.log('no image found to delete');
    return null;
  } catch (err: unknown) {
    console.error((err as Error).message);
  } finally {
    if (newPool) {
      newPool.release();
    }
  }
};
