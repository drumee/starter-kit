#!/bin/bash
# This script in intended setup Drumee Os environment
set -e
script_dir=$(dirname $(readlink -f $0))

cd $script_dir
mkdir -p drumee-os

cd drumee-os
for package in server-team ui-team static; do
  if [ -d $package/.git ]; then
    (cd $package && git pull) 
  else
    git clone https://github.com/drumee/$package.git
  fi
done
# cd $script_dir/drumee-os/server-team && npm i
# cd $script_dir/drumee-os/ui-team && npm i
# cd $script_dir/drumee-os/server-team && npm run deploy
# cd $script_dir/drumee-os/ui-team && npm run deploy

mkdir -p <%= storage_dir %>/db
mkdir -p <%= storage_dir %>/data

chmod +x $script_dir/container.d/*
rsync -ra $script_dir/configure/node_modules/@drumee/setup-infra $script_dir/container.d/
echo Setup completed. Run below command to 
docker compose -f $script_dir/docker.yaml up -d
docker exec -it starter-kit bash