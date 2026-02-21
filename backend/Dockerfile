FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Create media directory for shared volume
RUN mkdir -p /app/media/charts /app/media/audio /app/media/docs

# Install Python dependencies and application
RUN pip install --no-cache-dir .

# Expose port
EXPOSE 8000

# Production command: no --reload, multi-worker
# Workers override this in docker-compose
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
