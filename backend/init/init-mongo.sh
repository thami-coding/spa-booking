#!/bin/bash
set -e

echo "Restoring database dump..."

# The Atlas Local image provides the CONNECTION_STRING environment variable
mongorestore --uri "$CONNECTION_STRING" /data/dump

echo "Database restore completed."
