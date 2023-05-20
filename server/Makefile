init
	docker network create local-network

up_local:
	docker-compose -f ./docker-compose.local.yml up -d

migrate:
	npm run typeorm migration:run

migrate_rollback:
	npm run typeorm migration:revert
