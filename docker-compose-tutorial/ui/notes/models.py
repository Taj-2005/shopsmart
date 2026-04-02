from django.db import models


class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Use the same table that FastAPI's SQLAlchemy creates.
        # Both services share one table in the same Postgres database.
        db_table = "notes"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
