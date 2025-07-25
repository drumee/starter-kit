# Change below values accordingly to you setup

# This text will be shown on the login page
export DRUMEE_DESCRIPTION="My Drumee Box"

# This is the URL base to access your Drumee Instance
# It's recommanded not to share the domain name 
# with any oher applications
export DRUMEE_DOMAIN_NAME="thidima.org"

# Fix IPV4 address bound to your doamain_name
export PUBLIC_IP4="51.195.89.55"

# IPV6 address bound to your doamain_name
export PUBLIC_IP6="2001:41d0:700:4837::"

# This email will be use as the admin account
export ADMIN_EMAIL="somanos@drumee.com"

# Dedicated to data base server. Do not share with any
# other application. Default value is /srv/db. 
# At least 100GB should be allocated 
export DRUMEE_DB_DIR="/db" 

# Dedicated to Drumee Filesystem Management. 
# Do not share with any # other application. 
# Default value is /data 
# At least 100GB should be allocated 
export DRUMEE_DATA_DIR="/data" # defaulted to /data 

# Optional setting
# Drumee use rsync to backup data (FMS, DB and configs)
# If you plan to make a backup on a remote host, ensure
# ssh keys are properly setup
export STORAGE_BACKUP="/backup" # [user@host-or-ip:]/path/

# If not set, will be defaulted to ADMIN_EMAIL.
# SSL certificates are generated using zerossl.com ACME server
# This requires an emal to be provided.
export ACME_EMAIL_ACCOUNT="" 

mkdir -p $DRUMEE_DB_DIR
mkdir -p $DRUMEE_DATA_DIR
mkdir -p $STORAGE_BACKUP
