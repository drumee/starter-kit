# Drumee Starter Kit

This starter kit provides a basic application built with the Drumee framework, demonstrating how to integrate backend and frontend components. It aims to help developers quickly get started with Drumee development. It is not intended to be deployed on production, as it has been designed to run on a simplified environment, i.e localhost.

If you need to production ready installation, head to this page.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)



## Introduction

Drumee is an OS-like full-stack framework designed to simplify development by providing a single bundle, easy deployment, and a low learning curve SDK. This starter kit showcases a simple application that leverages Drumee's backend and frontend capabilities, allowing you to explore its features and build your own applications.


## Prerequisites

Before you begin, ensure you can comply to following requirements:

### Hardware
- RAM at least 8Go
- CPU at leat 2 GHz
- Enough space to host what you need

### Software
To avoid polluting your environment, this starter kit comes with a Docker image that already provides all dependencies. 
- Dokcer (28 or gigher)
- nodejs (22 or gigher)

If you don't have already Docker installed, please head to the [official installation guide](https://docs.docker.com/engine/install/debian/)

If you don't have already Nodejs installed, please follow (installation guide here)[https://nodejs.org/en/download/]


# Project Structure

```
.
├── bin              /** Shell scripts required by backend **/
│   └── ...
├── configure        /** Prepare the installation environment **/
│   └── ...
├── docker.d         /** Starter scripts for docker **/
│   └── ...
├── docker.yaml      /** Automatically generated. Do not change **/
├── drumee-os        /** Drumee OS sources. Use npm  run dev to make changes updated on the server **/
│   ├── server-team
│   └── ui-team
├── LICENSE
├── node_modules
│   ├── ...
│   └── ...
├── plugins          /** Plugins. **/
├── runtime          /** Drumee runtime directories (backend and frontend builds) **/
│   ├── server
│   ├── static
│   ├── tmp
│   └── ui
├── setup            /** Automatically generated. Do not change **/
├── storage          /** Drumee storage directories (db + meta file system) **/
│   ├── data
│   └── db
└── tree.md          /** This file **/
```


# Setup and Installation

Get the Drumee Starter Kit, this project.

```
  git clone https://github.com/drumee/starter-kit.git
```

After download completed, navigate into the starter-kit and run auto configuration

```
  cd starter-kit
  npm i
  npm run configure
```

The configuration utilities will create files, directories and install packages required to run Drumee OS. Plrease refer to the [Project Structure](#project-structure) to have an overview of each directory role. 

After the configuration completion, run. 

```
  npm run server.configure

```

The above command will configure the Docker container intended to host the Drumee Server. This command needs to be executed only once. At this step,your Drumee environment is ready.


# Running the Application

 After the server setup is sucessfully completed, start Drumee Server.

```
  npm run server.start
```

Set the admin password. Open the file storage/data/tmp/welcome.html and click on the link. Once the password set, the link is no more valid. If you want to change the password again, use the Drumee User Interface to do it.


# Backend Overview

Drumee is a pure client-side rendering application. There no code in the backend dedicated to handle frontend interaction. Backend source is installed in drumee-os/server-team. You can try changes on the backend with bellow command. 

```
  cd drumee-os/server-team 
  npm run dev
```

Changes on files from this directory will be synced to runtime/server/main and the server will automaticall restart.

Drumee backend is made of 3 processes, all managed through pm2.
To see all backend processes 

```
  npm run server.list
```

The *process* factory is a background one, it's dedicated to pre-build Databases Schemas, which are store in a pool for dynamic allocation.

The *main* is dedicated to serve the application loader and maintain websocket connection with client-side

The *main/service* is a micro services runner. See files in drumee-os/server-team/acl to explorer all availables services.

To see backend main process log. 

```
  npm run log.main
```

To see backend services process log. 

```
  npm run log.service
```

# Frontend Overview
Drumee is a pure client-side rendering application. The whole user interface is fully handled on the clien-side.Frontend source is installed in drumee-os/ui-team. You can try changes on the frontend with bellow command.

```
  cd drumee-os/ui-team 
  npm run dev
```

Changes on files from this directory will be bundle into runtime/ui/main the server will automaticall restart.




## Troubleshooting

*   **Port Conflicts:** If you encounter issues with applications not starting due to port conflicts, ensure that the `PORT` environment variable in your `.env` files is set to an available port.
*   **Dependency Issues:** If `npm install` fails, try clearing the npm cache (`npm cache clean --force`) and reinstalling.
*   **Backend/Frontend Communication:** Verify that `REACT_APP_API_URL` in your frontend `.env` file correctly points to your backend server address and port.
*   **Drumee Specific Issues:** For issues related to Drumee's core functionalities, refer to the official Drumee documentation and GitHub repositories.

## Contributing

We welcome contributions to this Drumee Starter Kit! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## References

[1] https://github.com/drumee/debian-hosted
[2] https://github.com/drumee/server-team
[3] https://github.com/drumee/server-essentials
[4] https://github.com/drumee/server-core
[5] https://github.com/drumee/ui-team



