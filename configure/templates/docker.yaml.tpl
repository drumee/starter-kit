
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
      - <%= src_dir %>/runtime:/var/lib/drumee/runtime
      - <%= src_dir %>/plugins:/var/lib/drumee/plugins
      - <%= src_dir %>/docker.d:/var/lib/drumee/start.d
      - <%= src_dir %>/bin:/usr/share/drumee/bin:ro
      - <%= share_home %>
    entrypoint: /bin/bash 
    #entrypoint: /var/lib/drumee/start.d/start
    stdin_open: true 
    tty: true 