import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  forcePathStyle: true,
  region: 'us-east-2',
  endpoint: 'https://zhraddrgoahbhyhfqrmq.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadImageFromFile(file: File, bucket: string, key: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer); 

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read', // Optional depending on your storage policy
  });

  try {
    await client.send(command);
    return `https://zhraddrgoahbhyhfqrmq.supabase.co/storage/v1/object/public/${bucket}/${key}`;
  } catch (err) {
    console.error('Upload failed:', err);
    return null
  }
}


export async function deleteImageFromKey(bucket: string, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    await client.send(command);
    return true;
  } catch (err) {
    console.error('Delete failed:', err);
    return false
  }
}