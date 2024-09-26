from django.db import models

from dvadmin.utils.models import CoreModel


# Create your models here.

class VectorDB(CoreModel):
    name = models.CharField(max_length=128, unique=True)
    host = models.CharField(max_length=32)
    port = models.CharField(max_length=16)
    class Meta:
        db_table = "assistant_vectordb"
        ordering = ("-create_datetime",)
        unique_together = [
            ("host", "port"),
        ]

class Splitter(CoreModel):
    SPLITTER_TYPE = (
        (0, "char"),
        (1, "json")
    )
    name = models.CharField(max_length=128, unique=True)
    type = models.SmallIntegerField(choices=SPLITTER_TYPE)
    parameters = models.TextField()
    class Meta:
        db_table = "assistant_splitter"
        ordering = ("-create_datetime",)



