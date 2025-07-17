
services:
  drumee:
    hostname: <%= hostname %>
    container_name: <%= container_name %> 
    image: drumee/starter-kit:latest
    ports:   
      - "<%= https_port %>:443/tcp"
      - "<%= http_port %>:80/tcp"

    volumes:
      - <%= storage_dir %>/db:/var/lib/drumee/db
      - <%= storage_dir %>/data:/var/lib/drumee/data
      - <%= src_dir %>/log:/var/log/drumee
      - <%= src_dir %>/runtime:/var/lib/drumee/runtime
      - <%= src_dir %>/plugins:/var/lib/drumee/plugins
      - <%= src_dir %>/container.d:/var/lib/drumee/start.d
      - <%= share_home %>
    entrypoint: /bin/bash 
    stdin_open: true 
    tty: true 