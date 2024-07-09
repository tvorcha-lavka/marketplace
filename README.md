# Marketplace

---
## System dependencies
- [Docker](https://www.docker.com/products/docker-desktop/)
- [GNU make](https://www.gnu.org/software/make/)
- [Python 3.11+](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org/docs/)

---
## Install GNU make:
### For Windows users:
1. **Install archive**: [GNU make](https://sourceforge.net/projects/ezwinports/files/make-4.4.1-without-guile-w32-bin.zip/download)
2. **Unzip to folder**: `C:\Program Files\GnuWin32`
3. **Add to PATH environment**:
    ```shell
    [System.Environment]::SetEnvironmentVariable("Path", $Env:Path + ";C:\Program Files\GnuWin32\bin", [System.EnvironmentVariableTarget]::Machine)
    ```
4. **Test command**:
    ```shell
    make --version
    ```

---
## Setup and Usage
### Environment Setup: `Frontend`

1. **Environment Variables**:
   - Copy `.env-example` to `.env`
   - Configure the necessary environment variables.

2. **Build project**:
    - ```bash
      make build
      ```

3. **Create superuser**:
    - ```bash
      make create-superuser
      ```

4. **Get access token**:
   - Open endpoint: `localhost:8000/api/auth/token/` and login with your superuser credentials

5. **Add access token to your headers**:
   - Install Google Chrome extension `ModHeader`
   - Put your access token to `Authorization` with value `Bearer <your_token>`

6. **Now you have access to docs endpoints**:
   - `localhost:8000/api/docs`
   - `localhost:8000/api/redoc`

---
### Environment Setup: `Backend`
1. **Environment Variables**:
   - Copy `.env-example` to `.env`
   - Configure the necessary environment variables.

2. **Install poetry dependencies**: 
    - ```bash
      cd backend && poetry install --no-root
      ```
3. **Setup pre-commit hook**:
    - ```bash
      cd backend && poetry run pre-commit install --install-hooks
      ```

---
## Commands GNU make
### To execute command, you need to install `GNU make`
- ### Docker:
  - To build Docker Images for frontend & backend, execute:
    ```bash
    make build
    ```

  - To rebuild Docker Images for frontend & backend, execute:
    ```bash
    make rebuild
    ```

  - To build Docker Image separate for frontend & backend, execute:
    ```bash
    make build-frontend
    ```
    ```bash
    make build-beckend
    ```

  - To rebuild Docker Image separate for frontend & backend, execute:
    ```bash
    make rebuild-frontend
    ```
    ```bash
    make rebuild-beckend
    ```

  - To run a project, execute:
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

  - To open Docker logs, execute:
    ```bash
    make logs
    ```


- ### Django:
  - To make new django migrations
    ```bash
    make migrations
    ```
  
  - To create django superuser
    ```bash
    make create-superuser
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

- ### Pytest:
  - To run pytest, execute:
    ```bash
    make pytest
    ```

  - To run pytest with coverage, execute:
    ```bash
    make pytest-cov
    ```
    
