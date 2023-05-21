init:
	docker network create local-network

up_local:
	docker-compose -f ./docker-compose.local.yml up -d

migrate:
	npm run typeorm:migrate

migrate_rollback:
	npm run typeorm migration:revert
