# !!!!!!! DO NOT EDIT !!!!!!!!
# Config file automatically generated 
# Purpose     : env var for Drumee server bundling
# Date        : <%= date %>
# -------------------------------------------------------------

export DEST_DIR=<%= server_bundle_dir %>
export ENDPOINT=<%= endpoint %>
export CONTAINER_NAME=<%= container_name %>
mkdir -p $DEST_DIR