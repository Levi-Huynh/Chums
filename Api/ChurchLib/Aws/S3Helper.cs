using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using NPOI.Util;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.IO;

namespace ChurchLib.Aws
{
    public class S3Helper
    {
        private static string awsBucket = AppSettings.Current.S3ContentBucket;
        private static AmazonS3Client _client = null;
        public static AmazonS3Client Client
        {
            get
            {
                if (_client == null) _client = new AmazonS3Client(AppSettings.Current.AwsKey, AppSettings.Current.AwsSecret, Amazon.RegionEndpoint.USEast2);
                return _client;
            }
        }


        public static string[] ListFiles(string bucketPath, string regexFilter = "")
        {
            List<string> result = new List<string>();
            ListObjectsV2Request req = new ListObjectsV2Request { BucketName = awsBucket, Prefix = bucketPath, MaxKeys=1000 };
            req.Prefix = bucketPath;
            req.MaxKeys = 1000;

            bool nextPage = true;
            while (nextPage)
            {
                ListObjectsV2Response resp = Client.ListObjectsV2Async(req).Result;
                foreach (S3Object obj in resp.S3Objects) if (regexFilter == "" || Regex.Match(obj.Key, regexFilter).Success) result.Add(obj.Key);
                if (resp.IsTruncated) req.ContinuationToken = resp.ContinuationToken; else nextPage = false;
            }
            return result.ToArray();
        }

        public static void RenameFile(string inputFile, string outputFile)
        {
            CopyObjectRequest req = new CopyObjectRequest()
            {
                SourceBucket = awsBucket,
                DestinationBucket = awsBucket,
                SourceKey = inputFile,
                DestinationKey = outputFile,
                CannedACL = S3CannedACL.PublicRead
            };
            Client.CopyObject(req);
            DeleteFile(inputFile, awsBucket);
        }

        public static bool DownloadFile(string localPath, string bucketPath, string bucketName = "")
        {
            return DownloadFiles(new string[] { localPath }, new string[] { bucketPath }, bucketName).Length == 0; //success
        }

        public static string[] DownloadFiles(string[] localPaths, string[] bucketPaths, string bucketName = "")
        {
            if (bucketName == "") bucketName = awsBucket;
            List<string> errors = new List<string>();
            if (localPaths.Length == 0 || localPaths.Length != bucketPaths.Length) return bucketPaths;
            TransferUtility util = new TransferUtility(Client);
            for (int i = 0; i < localPaths.Length; i++)
            {
                try { util.Download(localPaths[i], bucketName, bucketPaths[i]); }
                catch { errors.Add(bucketPaths[i]); }
            }
            return errors.ToArray();
        }

        public static void WriteContent(string key, string content, string contentType)
        {
            Client.PutObjectAsync(new Amazon.S3.Model.PutObjectRequest()
            {
                BucketName = awsBucket,
                ContentBody = content,
                ContentType = contentType,
                Key = key,
                CannedACL = S3CannedACL.PublicRead
            }).Wait();
        }

        public static void WriteBytes(string key, byte[] content, string contentType)
        {
            MemoryStream input = new MemoryStream(content);
            Client.PutObjectAsync(new Amazon.S3.Model.PutObjectRequest()
            {
                BucketName = awsBucket,
                InputStream = input,
                Key = key,
                CannedACL = S3CannedACL.PublicRead
            }).Wait();
            input.Close();
        }


        public static bool WriteFile(string localPath, string bucketPath, string bucketName = "", bool publicRead = true)
        {
            return WriteFiles(new string[] { localPath }, new string[] { bucketPath }, bucketName, publicRead).Length == 0; //success
        }

        public static void SetPublicRead(string key)
        {
            PutACLRequest req = new PutACLRequest()
            {
                BucketName = awsBucket,
                Key = key,
                CannedACL = S3CannedACL.PublicRead
            };
            Client.PutACL(req);
        }

        public static string[] WriteFiles(string[] localPaths, string[] bucketPaths, string bucketName = "", bool publicRead = true)
        {
            if (bucketName == "") bucketName = awsBucket;
            List<string> errors = new List<string>();
            if (localPaths.Length == 0 || localPaths.Length != bucketPaths.Length) return bucketPaths;
            TransferUtility util = new TransferUtility(Client);
            for (int i = 0; i < localPaths.Length; i++)
            {
                try
                {
                    TransferUtilityUploadRequest req = new TransferUtilityUploadRequest
                    {
                        FilePath = localPaths[i],
                        BucketName = bucketName,
                        Key = bucketPaths[i],
                        CannedACL = (publicRead) ? S3CannedACL.PublicRead : S3CannedACL.Private
                    };
                    util.Upload(req);
                }
                catch (Exception ex) { errors.Add(bucketPaths[i]); }
            }
            return errors.ToArray();
        }

        public static void WriteFolder(string localPath, string bucketPath, string bucketName = "", bool publicRead = true)
        {
            if (bucketName == "") bucketName = awsBucket;
            List<string> physicalPaths = new List<string>();
            foreach (string file in System.IO.Directory.GetFiles(localPath)) physicalPaths.Add(file);
            foreach (string dir in System.IO.Directory.GetDirectories(localPath))
                foreach (string file in System.IO.Directory.GetFiles(dir)) physicalPaths.Add(file);

            string basePath = localPath;
            List<string> virtualPaths = new List<string>();
            foreach (string file in physicalPaths) virtualPaths.Add(bucketPath + file.Replace(basePath, "").Replace("\\", "/"));
            WriteFiles(physicalPaths.ToArray(), virtualPaths.ToArray(), bucketName, publicRead);
        }

        public static void DeleteFile(string bucketPath, string bucketName = "")
        {
            DeleteFiles(new string[] { bucketPath }, bucketName);
        }

        public static void DeleteFiles(string[] bucketPaths, string bucketName = "")
        {
            if (bucketName == "") bucketName = awsBucket;
            if (bucketPaths.Length == 0) return;
            List<KeyVersion> objects = new List<KeyVersion>();
            for (int i = 0; i < bucketPaths.Length; i++)
            {
                objects.Add(new KeyVersion() { Key = bucketPaths[i] });
            }
            DeleteObjectsRequest req = new DeleteObjectsRequest { BucketName = bucketName, Objects = objects };
            Client.DeleteObjectsAsync(req).Wait();
        }
    }
}
