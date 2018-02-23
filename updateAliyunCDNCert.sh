#!/bin/bash

set -e

for DOMAIN in $RENEWED_DOMAINS
do
    node /usr/local/bin/certUpdater/index.js $DOMAIN $RENEWED_LINEAGE >> /var/log/certUpdater.log
done
