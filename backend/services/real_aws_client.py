import os
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class RealS3Client:
    """
    Real AWS S3 client using boto3.
    Used when AWS credentials are available.
    """

    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
        )

    def upload_file(self, file_path, bucket_name, object_name=None):
        if object_name is None:
            object_name = os.path.basename(file_path)

        try:
            self.s3.upload_file(file_path, bucket_name, object_name)

            logger.info(f"Uploaded {object_name} to {bucket_name}")

            return {
                "success": True,
                "bucket": bucket_name,
                "key": object_name,
                "url": f"s3://{bucket_name}/{object_name}"
            }

        except ClientError as e:
            logger.error(e)
            return {"success": False, "error": str(e)}

    def download_file(self, bucket_name, object_name, download_path):
        try:
            self.s3.download_file(bucket_name, object_name, download_path)

            logger.info(f"Downloaded {object_name} from {bucket_name}")

            return {
                "success": True,
                "path": download_path
            }

        except ClientError as e:
            logger.error(e)
            return {"success": False, "error": str(e)}

    def delete_file(self, bucket_name, object_name):
        try:
            self.s3.delete_object(
                Bucket=bucket_name,
                Key=object_name
            )

            logger.info(f"Deleted {object_name} from {bucket_name}")

            return {"success": True}

        except ClientError as e:
            logger.error(e)
            return {"success": False, "error": str(e)}