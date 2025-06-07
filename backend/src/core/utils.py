import os

__all__ = [
    "check_db_host",
    "settings_module",
]

env_state = os.getenv("ENV_STATE", "development")
postgres_host = os.getenv("POSTGRES_HOST", "host.docker.internal")


def check_db_host() -> None:
    if env_state == "development" and postgres_host != "host.docker.internal":
        print(
            "\n\033[91m" + "WARNING: Your environment is DEV.\033[0m"
            "\n\033[91m" + "Note that you will be working with a remote database!\n\033[0m"
        )


def _get_settings_module() -> str:
    module_map = {
        "development": "core.settings.development",
        "production": "core.settings.production",
        "staging": "core.settings.production",
    }

    return module_map.get(env_state, module_map["development"])


settings_module = _get_settings_module()
