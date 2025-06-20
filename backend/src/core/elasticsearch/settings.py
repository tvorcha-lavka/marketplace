from pydantic_settings import BaseSettings, SettingsConfigDict


class ElasticsearchSettings(BaseSettings):

    HOSTS: list[str] = ["http://elasticsearch:9200"]
    USERNAME: str = "elastic"
    PASSWORD: str = ""
    USE_SSL: bool = False
    VERIFY_CERTS: bool = True

    model_config = SettingsConfigDict(
        env_prefix="ELASTIC_",
        case_sensitive=True,
    )

    @property
    def BASIC_AUTH(self) -> tuple[str, str] | None:  # noqa
        if self.PASSWORD:
            return self.USERNAME, self.PASSWORD
        return None


elasticsearch_settings = ElasticsearchSettings()
