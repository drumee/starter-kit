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

# Install server part
srv_tmp_rc=$script_dir/drumee-os/tmp/server-team/.dev-tools.rc
srv_rc=$script_dir/drumee-os/server-team
if [ -d $srv_tmp_rc ]; then
  rsync -rav $srv_tmp_rc $srv_rc/
  rm -rf $srv_tmp_rc
fi
cd $srv_rc && npm i && npm run deploy

# Install UI part
ui_tmp_rc=$script_dir/drumee-os/tmp/ui-team/.dev-tools.rc
ui_rc=$script_dir/drumee-os/ui-team
if [ -d $ui_tmp_rc ]; then
  rsync -rav $ui_tmp_rc $ui_rc/
  rm -rf $ui_tmp_rc
fi

cd $ui_rc && npm i && npm run deploy


# Drumee Data directories
mkdir -p <%= storage_dir %>/db
mkdir -p <%= storage_dir %>/data
mkdir -p <%= src_dir %>/runtime/static

# Install server static files
cd <%= src_dir %>/runtime
if [ -d static/.git ]; then
  (cd static && git pull) 
else
  git clone https://github.com/drumee/static.git
fi

mkdir -p <%= src_dir %>/runtime/tmp
docker compose -f $script_dir/docker.yaml up -d
#docker exec -it starter-kit bash