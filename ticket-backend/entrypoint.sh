#!/bin/bash
set -e

sea-orm-cli migrate up

exec "$@"
