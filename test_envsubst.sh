#!/bin/bash
echo 'server { try_files \$\ \$\/ /index.html; }' > test.template
export PORT=8080
envsubst < test.template
