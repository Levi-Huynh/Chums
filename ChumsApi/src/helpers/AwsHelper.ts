import AWS from 'aws-sdk'
import { ByteBuffer } from 'aws-sdk/clients/cloudtrail';

export class AwsHelper {
    private static _isConfigured = false;
    private static _s3Bucket = process.env.AMAZON_S3_BUCKET;

    private static configure() {
        if (!this._isConfigured) {
            const config = {
                accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
                secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
                region: process.env.AMAZON_REGION
            }
            AWS.config.update(config);
            this._isConfigured = true;
        }
    }

    private static S3() {
        this.configure();
        return new AWS.S3({ apiVersion: '2006-03-01' });
    }

    static S3Upload(key: string, contentType: string, contents: ByteBuffer): Promise<void> {
        return new Promise((resolve, reject) => {
            const params: AWS.S3.PutObjectRequest = { Bucket: AwsHelper._s3Bucket, Key: key, Body: contents, ACL: 'public-read', ContentType: contentType }
            this.S3().upload(params, (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    static async S3List(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.S3().listObjectsV2({ Bucket: AwsHelper._s3Bucket, Prefix: path }, (error: Error, data: AWS.S3.ListObjectsV2Output) => {
                if (error) reject(error);
                else {
                    const result: string[] = [];
                    data.Contents.forEach(v => { result.push(v.Key) });
                    resolve(result)
                }
            });
        });
    }

    static async S3Read(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.S3().getObject({ Bucket: AwsHelper._s3Bucket, Key: key }, (error: Error, data: AWS.S3.GetObjectOutput) => {
                if (error) resolve(null);
                else resolve(data.Body.toString());
            });
        });
    }


}