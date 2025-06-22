# === Makefile ===

# Development
dev:
	docker compose -f docker-compose.dev.yml up --build

# Production
prod:
	docker compose -f docker-compose.yml up --build

# Stop all containers
stop:
	docker compose down

# Rebuild (dev)
rebuild:
	docker compose -f docker-compose.dev.yml build --no-cache

# DB shell access
psql:
	docker exec -it url-db psql -U user -d shortener

# Clean volumes (dangerous: removes DB data)
clean:
	docker compose down -v
