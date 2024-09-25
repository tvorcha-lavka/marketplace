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
   - Open endpoint: `localhost:8000/api/auth/login/` and login with your superuser credentials

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

---
# Django Translations Guide
This document provides instructions on how to set up and use translations in a Django project.

## 1. GetText Installation
To enable translation support, follow these steps, or you can skip this step and use `gettext` in docker:
  - Download [GetText](https://mlocati.github.io/articles/gettext-iconv-windows.html)
  - After installation, add the `bin` folder of GetText to your system `PATH` environment variable.

## 2. Usage
### Defining Translatable Messages
To define a translatable message in your code, import the `gettext_lazy` function from `django.utils.translation`:

```python
from django.utils.translation import gettext_lazy as _

message = _("Example message")
```

### Creating New Translatable Messages
To create or update the Ukrainian translation file, run the following command:
```bash
# if you have installed locally `gettext`
django-admin makemessages -l uk
```
```bash
# if you don't have `gettext` locally and want to use it in docker.
docker compose run --rm backend django-admin makemessages -l uk
```
This command scans your code for translatable strings and generates a .po file for the specified language.


### Compiling Translations
After configuring your translations, compile them using:
```bash
django-admin compilemessages
```
This command generates the compiled .mo files needed for your application to use the translations.

### Additional Notes
- Make sure to restart your Django server after making changes to translation files to see the updates.
- You can add translations for other languages by repeating the `makemessages` command with the appropriate language code.
