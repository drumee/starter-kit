#!/bin/bash
# This script in intended setup Drumee Os environment
set -e
script_dir=$(dirname $(readlink -f $0))

cd $script_dir

# Live directories 
mkdir -p drumee-os  # Drumee source modules
mkdir -p runtime    # Drumee runtime modules
mkdir -p plugins    # Customer plugins
mkdir -p log
cd drumee-os
for package in server-team ui-team; do
  if [ -d $package/.git ]; then
    (cd $package && git pull) 
  else
    git clone -b starter-kit https://github.com/drumee/$package.git
  fi
done

cd $script_dir/drumee-os/server-team && npm i
cd $script_dir/drumee-os/ui-team && npm i
cd $script_dir/drumee-os/server-team && npm run deploy
cd $script_dir/drumee-os/ui-team && npm run deploy

# Drumee Data directories
mkdir -p <%= storage_dir %>/db
mkdir -p <%= storage_dir %>/data
mkdir -p <%= src_dir %>/runtime/static

cd <%= src_dir %>/runtime
if [ -d static/.git ]; then
  (cd static && git pull) 
else
  git clone https://github.com/drumee/static.git
fi

docker compose -f $script_dir/docker.yaml up -d
#docker exec -it starter-kit bash