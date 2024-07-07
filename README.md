# Marketplace

---
## System dependencies
- [Docker](https://www.docker.com/products/docker-desktop/)
- [GNU make](https://www.gnu.org/software/make/)
- [Python 3.11+](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org/docs/)

---
## Setup and Usage
### Environment Setup

1. **Environment Variables**: Copy `.env-example` to `.env` and configure the necessary environment variables.
2. **Execute command**: `pre-commit install --install-hooks`

---
## Commands GNU make
### To execute command, you need to install `GNU make`
- ### Docker:
  - To build Docker Images for frontend & backend, execute:
    ```bash
    make build
    ```

  - To build Docker Image for frontend or backend, execute:
    ```bash
    make build-frontend
    ```
    ```bash
    make build-beckend
    ```

  - To run previously created Docker Images, execute:
    ```bash
    make up
    ```

  - To stop a project, execute:
    ```bash
    make stop
    ```

  - To stop a project & destroy Doker Containers, execute:
    ```bash
    make down
    ```

  - To rebuild project, execute:
    ```bash
    make rebuild
    ```

  - To open Docker logs, execute:
    ```bash
    make logs
    ```


- ### Django:
  - To make new django migrations
    ```bash
    make migrations
    ```


- ### Linters & Code Formatters:
  - To start linting code, execute:
    ```bash
    make lint
    ```

  - To reformat code, execute:
    ```bash
    make reformat
    ```