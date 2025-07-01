from enum import StrEnum


class QueueEnum(StrEnum):
    DATABASE = "database.queue"
    ELASTICSEARCH = "elasticsearch.queue"

    FILE_OPTIMIZER = "file-optimizer.queue"
    FILE_UPLOADER_DB = "file-uploader.db.queue"
    FILE_UPLOADER_S3 = "file-uploader.s3.queue"

    NOTIFICATION = "notification.queue"
    ORCHESTRATOR = "orchestrator.queue"
    STATISTICS = "statistics.queue"
