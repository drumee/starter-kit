# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not** the Drumee application source — it is an orchestration/scaffolding kit that
configures, builds, and runs a local Drumee instance inside a Docker container. The actual
backend and frontend source are cloned at setup time from separate GitHub repos into
`drumee-os/` (which is gitignored and absent until you run `./setup`):

- `drumee-os/server-team` — backend source (cloned from `github.com/drumee/server-team`)
- `drumee-os/ui-team` — frontend source (cloned from `github.com/drumee/ui-team`)

Drumee is a pure client-side-rendering app: the backend serves only the loader and a
WebSocket connection; there is no server-side frontend rendering.

## Two-phase setup

Setup is intentionally split between the **host** and **inside the container**:

1. **Host configuration** — `npm run configure` runs `configure/index.js`, which renders
   templates from `configure/templates/` (via lodash `template()`) into generated files:
   `docker.yaml`, `setup`, `docker.d/configure`, and the `drumee-os/tmp/*/.dev-tools.rc/*`
   scripts. It then runs `./setup`, which clones the source repos, `npm i && npm run deploy`s
   them into `runtime/`, clones static assets, and starts the container via `docker compose`.
2. **In-container configuration** — `npm run server.configure` execs `docker.d/configure`
   inside the container. This runs `setup-infra`, populates MariaDB (`schemas/populate` +
   `schemas/index.js`), pre-builds the DB schema pools, and creates the admin user.

`docker.yaml`, `setup`, and `docker.d/configure` are **generated** — edit the templates in
`configure/templates/`, not the outputs.

## Common commands

All `server.*` and `log.*` scripts are thin wrappers around `docker exec` into the
container named `starter-kit`.

```bash
npm i                      # preinstall hook also installs docker.d/ and configure/ deps
npm run configure          # host-side: generate configs + clone/build sources + start container (once)
npm run server.configure   # in-container: infra + DB + admin setup (once)
npm run server.start       # start daemons (mariadb, nginx, redis, pm2 ecosystem)
npm run server.stop        # pm2 stop all
npm run server.status      # pm2 list
npm run server.shell       # bash shell inside the container
npm run log.main           # tail the 'main' pm2 process log
npm run log.service        # tail the 'main/service' pm2 process log
```

After `server.start`, set the admin password via the link in
`storage/data/tmp/welcome.html` (single-use).

## Backend processes (pm2)

The backend runs as three pm2-managed processes:

- **`factory`** — background process that pre-builds database schemas into a pool for
  dynamic allocation (see the `make_schema('drumate')` / `make_schema('hub')` loops in
  `docker.d/schemas/index.js`).
- **`main`** — serves the application loader and maintains the client WebSocket connection.
- **`main/service`** — microservices runner. Available services are defined in
  `drumee-os/server-team/acl`.

## Development loop

To modify backend or frontend, edit inside the cloned source dir and run its watcher:

```bash
cd drumee-os/server-team && npm run dev   # syncs changes to runtime/server/main, auto-restarts
cd drumee-os/ui-team && npm run dev       # bundles into runtime/ui/main, auto-restarts
```

The `runtime/` directories (`server`, `ui`, `static`, `tmp`) are bind-mounted into the
container, so a rebuild on the host is picked up by the running server.

## Layout notes

- `bin/` — host shell scripts mounted read-only into the container at
  `/usr/share/drumee/bin` (MFS copy/swap helpers, zip, doc preview, soffice).
- `docker.d/` — mounted into the container at `/var/lib/drumee/start.d`; holds the
  in-container `configure`/`start` entrypoints and the `schemas/` DB seeders.
- `docker.d/schemas/templates/` — SQL: schema templates (`drumate.sql`, `hub.sql`) and
  `seed/` databases (`yp`, `mailserver`, `template`, `trash`, `utils`).
- `storage/db` (MariaDB) and `storage/data` (Drumee meta filesystem) are the persistent
  bind-mounted state.
- Most `drumee-os/`, `runtime/`, `storage/`, `plugins/`, and generated files are gitignored.

The container exposes HTTP on host `8080` (→80) and HTTPS on `4443` (→443), as configured
by the `--http-port`/`--https-port` args to `npm run configure`.
