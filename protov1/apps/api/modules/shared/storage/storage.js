// Storage Helper - Backblaze B2 (S3 compatible) or Local

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageProvider = process.env.STORAGE_PROVIDER || 'backblaze';

// Initialize S3 client (works with Backblaze B2)
const s3Client = storageProvider === 'backblaze' ? new S3Client({
  endpoint: process.env.S3_ENDPOINT || process.env.B2_ENDPOINT,
  region: process.env.B2_REGION || 'us-west-002', // Backblaze region
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY || process.env.B2_ACCOUNT_ID,
    secretAccessKey: process.env.B2_SECRET_KEY || process.env.B2_APPLICATION_KEY,
  },
}) : null;

const bucketName = process.env.B2_BUCKET;

// Local storage directory
const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Upload file to storage
 */
export async function uploadFile({ buffer, filename, contentType }) {
  try {
    if (storageProvider === 'local') {
      // Local storage implementation
      const filePath = path.join(LOCAL_STORAGE_DIR, filename);
      const fileDir = path.dirname(filePath);
      
      // Create directory structure including subdirectories
      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      
      const publicUrl = `${process.env.APP_URL}/uploads/${filename}`;
      console.log(`[Storage] File uploaded locally: ${filename}`);
      return publicUrl;
    }
    
    // Backblaze B2 implementation
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read', // Or use 'private' and generate signed URLs
    });

    await s3Client.send(command);

    // Construct public URL (remove https:// if already in endpoint)
    const endpoint = (process.env.S3_ENDPOINT || process.env.B2_ENDPOINT).replace('https://', '');
    const publicUrl = `https://${endpoint}/file/${bucketName}/${filename}`;
    
    console.log(`[Storage] File uploaded: ${filename}`);
    
    return publicUrl;
  } catch (error) {
    console.error('[Storage] Upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Download file from storage
 */
export async function downloadFile(filename) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    const response = await s3Client.send(command);
    const stream = response.Body;

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error('[Storage] Download error:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

/**
 * Generate signed URL for private files
 */
export async function getSignedDownloadUrl(filename, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('[Storage] Signed URL error:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(filename) {
  try {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    await s3Client.send(command);
    console.log(`[Storage] File deleted: ${filename}`);
  } catch (error) {
    console.error('[Storage] Delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * List files in a folder
 */
export async function listFiles(prefix = '') {
  try {
    const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error('[Storage] List error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}
