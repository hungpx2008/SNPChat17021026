import logging
from vanna.legacy.openai import OpenAI_Chat
from vanna.legacy.qdrant import Qdrant_VectorStore
from qdrant_client import QdrantClient
from openai import OpenAI
from src.core.config import get_settings
from sqlalchemy.engine.url import make_url

logger = logging.getLogger(__name__)
settings = get_settings()

class CustomVanna(Qdrant_VectorStore, OpenAI_Chat):
    def __init__(self, config=None):
        # Initialize embedding client FIRST because Qdrant init calls generate_embedding
        self.openai_embedding_client = OpenAI(
            api_key=config.get("api_key"),
            base_url=config.get("base_url")
        )
        
        # Initialize OpenAI Chat
        OpenAI_Chat.__init__(self, config=config)
        # Initialize Qdrant Store (triggers setup_collections -> generate_embedding)
        Qdrant_VectorStore.__init__(self, config=config)

    def generate_embedding(self, data: str, **kwargs) -> list[float]:
        # Override to use OpenAI embeddings (1536 dim)
        data = data.replace("\n", " ")
        response = self.openai_embedding_client.embeddings.create(
            input=[data],
            model="text-embedding-3-small"
        )
        return response.data[0].embedding

def setup_vanna():
    """Initialize Vanna with Qdrant (using OpenAI embeddings) and Postgres connection."""
    try:
        # Check required settings
        api_key = settings.openai_api_key or settings.openrouter_api_key
        if not api_key:
            logger.warning("No OpenAI/OpenRouter API key found. Vanna will not be initialized.")
            return None

        # Initialize Qdrant Client for Vanna
        qdrant_client = QdrantClient(
            url=settings.qdrant_http_url,
        )
        
        # Initialize CustomVanna instance
        # collection_name changed to 'vanna_schemas_openai' to separate from any default fastembed collection
        vn = CustomVanna(config={
            'client': qdrant_client,
            'api_key': api_key,
            'base_url': settings.openai_base_url,
            'model': settings.llm_model,
            'collection_name': 'vanna_schemas_openai' 
        })

        # Connect to Postgres
        # parse database_url
        if not settings.database_url:
             logger.error("DATABASE_URL is missing.")
             return None
             
        url = make_url(settings.database_url)
        
        vn.connect_to_postgres(
            host=url.host,
            dbname=url.database,
            user=url.username,
            password=url.password,
            port=url.port or 5432
        )
        
        logger.info("Vanna initialized with CustomVanna (OpenAI Embeddings) and Postgres.")
        return vn

    except Exception as e:
        logger.error(f"Failed to initialize Vanna: {e}")
        return None

# Singleton instance
vn = setup_vanna()
