#!/bin/sh

set -e

if [ "$SKIP_DB_PUSH" != true ] && [ -f ./dist/prisma/schema.prisma ]; then
  npx --yes --quiet prisma db push --schema=./dist/prisma/schema.prisma
fi

exec "$@"
