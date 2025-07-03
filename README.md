# Drumee Starter Kit

This starter kit provides a basic application built with the Drumee framework, demonstrating how to integrate backend and frontend components. It aims to help developers quickly get started with Drumee development.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)



## Introduction

Drumee is an OS-like full-stack framework designed to simplify development by providing a single bundle, easy deployment, and a low learning curve SDK. This starter kit showcases a simple application that leverages Drumee's backend and frontend capabilities, allowing you to explore its features and build your own applications.

For now, Drumee server is available on Debian and derivatives Distribution only. Nerverthless, being a web application, Drumee clients are obviously available on any platforms with modern browsers. A Desktop is also available.

## Dependencies
- Debian 11 or higher
- nginx
- mariadb
- prosody
- jitsi-meet
- nodejs
- bind9
- graphicsmagick
- ffmpeg
- redis
- libreoffice
- postfix
- opendkim

This starter kit comes with installation scripts that will install automatically thes depencies.

## Prerequisites

Before you begin, ensure you can comply to following requirements:

### Hardware
- RAM at least 8Go
- CPU at leat 2 GHz
- Enough space to host what you need

### Drumee OS 
To use the Starter Kit, you need to install Drumee OS by following one of below methods. Each has different requirements and purposes.

#### Installation on a public domain, reachable world wide
This installation mode is intended for production deployment on public internet domain, you will need to fulfill following requirements.
- A maiden Internet domain name
- Control Access to your DNS zone
- Control Access to your GLU DNS
- At least one Public IP addresses, IPV4 and/or IPV6

**Caution: The provided domain name can not be shared with existing or futur application. It is recommanded not to share DB server with any other application**
Go to this link to poceed to the public domain installation.

#### Installation on a private domain, reachable only from your local network
This installation mode may be used as production or developement plateform on your private network, you will need to fulfill following requirements.
- Change local clients DNS resolvers to add Drumee Server as its own domain name server

**Caution: It is recommanded not to share DB server with any other application**
Go to this link to poceed to the public domain installation.

#### Installation on your local host
This installation mode is inteded for develpment purpose only. Some funcintionalities such as video conference may not work properly.
Work in progress. Contributors are welcomed to npmify Drumee OS. The aim is to reduce installtion process into npm -g drumee-os.



## Setup and Installation
Ensure you have installed Drumee OS, as described earlier in ## Prerequisites section.
Follow these steps to set up and install the Drumee Starter Kit on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/drumee-starter-kit.git
    cd drumee-starter-kit
    ```

    *(Note: Replace `https://github.com/your-username/drumee-starter-kit.git` with the actual repository URL once it's created.)*

2.  **General Setup:**

    Navigate to the `server` directory and install the dependencies:

    ```bash
    npm run configure
    ```

    After installation, a directory named .dev-tools.rc will automatically created. 

    Open the newly created `.dev-tools.rc/devel.sh` file and configure the necessary environment variables. 

3.  **Frontend Setup:**

    Navigate to the `ui` directory and install the dependencies:

    ```bash
    cd ../ui
    npm install
    ```
    Open the file `webpack.options.json` file and configure the necessary environment variables. 



## Running the Application

Once both the backend and frontend dependencies are installed and configured, you can run the application:

1.  **Start the Backend Server:**

    From the `backend` directory, run:

    ```bash
    npm start
    ```

    This will start the Drumee backend server, typically on `http://localhost:3000` (or the port specified in your backend `.env` file).

2.  **Start the Frontend Application:**

    From the `frontend` directory, run:

    ```bash
    npm start
    ```

    This will launch the React development server, usually opening the application in your browser at `http://localhost:3001` (or the port specified in your frontend `.env` file).

    You should now be able to interact with the Drumee starter application in your web browser.




## Backend Overview

The `backend` directory contains a Node.js application that serves as the API for the Drumee starter kit. It leverages the following core Drumee modules:

*   **`@drumee/server-team`**: This package provides Drumee Team Services API, offering functionalities like identity management (yellow page) and filesystem management. It also supports open or closed groups, and integrates Jitsi and chat features [2].
*   **`@drumee/server-essentials`**: These are essential modules required to run every Drumee backend component. They provide foundational functionalities for the Drumee ecosystem [3].
*   **`@drumee/server-core`**: This module contains the core library to run every Drumee Backend Services and Drumee Server Common Library [4].

The `backend/src/app.js` file will contain a basic example of how to define API routes and interact with Drumee's backend services. A simple CRUD (Create, Read, Update, Delete) example will be provided to demonstrate data interaction.




## Frontend Overview

The `frontend` directory hosts a React application that consumes the APIs exposed by the Drumee backend. It utilizes the `@drumee/ui-team` for building the user interface. The `ui-team` repository, while currently lacking a detailed README, is expected to provide components and utilities for building Drumee-compatible user interfaces [5].

The `frontend/src/App.js` and `frontend/src/index.js` files will demonstrate how to make API calls to the backend and render data within a React component. A simple user interface will be provided to interact with the CRUD example implemented in the backend.




## Configuration

Both the backend and frontend applications rely on environment variables for configuration. These variables are loaded from `.env` files located in their respective directories (`backend/.env` and `frontend/.env`).

**Backend Configuration (`backend/.env`):

```ini
# Example environment variables for the backend
PORT=3000
DB_HOST=localhost
DB_USER=drumee_user
DB_PASSWORD=drumee_password
DB_NAME=drumee_db
# Add any other backend-specific configurations here
```

**Frontend Configuration (`frontend/.env`):

```ini
# Example environment variables for the frontend
REACT_APP_API_URL=http://localhost:3000
# Add any other frontend-specific configurations here
```

**Important:**

*   Never commit your `.env` files to version control. The `.gitignore` file is already configured to ignore these files.
*   The `.env.example` files serve as templates, outlining the required environment variables. Copy them to `.env` and fill in your specific values.




## Deployment

This starter kit can be deployed in various ways, depending on your infrastructure and preferences. Here, we outline two common approaches:

### 1. Bare Metal / Virtual Machine Deployment (Debian-based)

For deploying on a bare metal server or virtual machine running Debian 11 or higher, you can leverage the `debian-hosted` repository provided by Drumee [1]. This repository contains scripts and configurations for setting up the necessary dependencies (nginx, mariadb, prosody, jitsi-meet, nodejs, bind9, graphicsmagick, ffmpeg, redis, libreoffice, postfix, opendkim) and installing Drumee.

**Steps:**

1.  **Prepare your Debian server:** Ensure your server meets the minimum requirements (8GB RAM, 2GHz CPU, sufficient disk space) and has a dedicated domain name with controlled DNS access.
2.  **Configure DNS:** Update your DNS zone with the A and AAAA records pointing to your server's IP addresses, as described in the `debian-hosted` README [1].
3.  **Clone `debian-hosted`:**

    ```bash
    git clone https://github.com/drumee/debian-hosted.git
    cd debian-hosted
    ```

4.  **Configure `drumee.sh`:** Copy `env.sh` to `drumee.sh` and edit `drumee.sh` to match your server's configuration and domain name.
5.  **Run the installer:** Execute the `./install` script as a root user.
6.  **Deploy the starter kit:** After Drumee is installed, you can deploy your backend and frontend applications to the appropriate directories on your server. The `scripts/deploy.sh` in this starter kit will provide an example of how to automate this process.

### 2. Docker Deployment

For a more containerized approach, you can use Docker. Drumee provides Docker images that simplify the deployment process. Refer to the Drumee documentation for details on installing Drumee Docker Image [2].

**Steps:**

1.  **Install Docker:** Ensure Docker and Docker Compose are installed on your deployment environment.
2.  **Build Docker images:** Create Dockerfiles for your backend and frontend applications within this starter kit. These Dockerfiles will build images containing your application code and dependencies.
3.  **Docker Compose:** Use Docker Compose to define and run your multi-container Drumee application. A `docker-compose.yml` file will orchestrate the backend, frontend, and any necessary Drumee services.
4.  **Run Docker Compose:**

    ```bash
    docker-compose up -d
    ```

    This will start all services defined in your `docker-compose.yml` in detached mode.




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



