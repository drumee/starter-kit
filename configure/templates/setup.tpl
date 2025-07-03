#!/bin/bash
# This script in intended setup Drumee Os environment
set -e
script_dir=$(dirname $(readlink -f $0))

cd $script_dir
mkdir -p drumee-os

cd drumee-os
for package in server-team ui-team; do
  if [ -d $package/.git ]; then
    (cd $package && git pull) 
  else
    git clone https://github.com/drumee/$package.git
  fi
done

cd $script_dir
for package in static; do
  if [ -d $package/.git ]; then
    (cd $package && git pull) 
  else
    git clone https://github.com/drumee/$package.git
  fi
done

mkdir -p <%= storage_dir %>/db
mkdir -p <%= storage_dir %>/data

cd $script_dir/start.d
npm i

echo Setup completed. Run below command to 
echo sudo docker compose -f $script_dir/docker.yaml up -d