#!/bin/bash
set -e

go run /app/cmd/bin/main.go db init
go run /app/cmd/bin/main.go db migrate

exec "$@"