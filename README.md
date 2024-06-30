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

---
## Make commands:
### **To execute command, you need to install `GNU make`**


**1. To build Docker Images for frontend & backend, execute:**
```bash
make build
```

**2. To build Docker Image for frontend or backend, execute:**
```bash
make build-frontend
```
```bash
make build-beckend
```

**3. To run previously created Docker Images, execute:**
```bash
make up
```

**4. To stop a project, execute:**
```bash
make stop
```

**5. To stop a project & destroy Doker Containers, execute:**
```bash
make down
```

**6. To rebuild project, execute:**
```bash
make rebuild
```

**7. To open Docker logs, execute:**
```bash
make logs
```