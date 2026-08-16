import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * StorageService — Manages pre-signed S3/R2 upload and download URLs.
 * Clients upload directly to object storage rather than streaming bytes through the API.
 */
@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const region = this.configService.get<string>('S3_REGION') || 'auto';
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY') || 'mock_access_key';
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY') || 'mock_secret_key';

    this.bucket = this.configService.get<string>('S3_BUCKET') || 'thabrez-tax-documents';

    this.s3Client = new S3Client({
      region,
      ...(endpoint && { endpoint }),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  /**
   * Generates a pre-signed PUT URL for direct client upload to S3.
   */
  async generateUploadUrl(
    s3Key: string,
    contentType: string,
    expiresInSeconds = 900,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
  }

  /**
   * Generates a pre-signed GET URL for secure, temporary document download.
   */
  async generateDownloadUrl(
    s3Key: string,
    filename?: string,
    expiresInSeconds = 900,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      ...(filename && {
        ResponseContentDisposition: `attachment; filename="${encodeURIComponent(filename)}"`,
      }),
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
  }
}
