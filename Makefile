.PHONY: up up-backend up-frontend stop stop-backend stop-frontend down down-backend down-frontend

up: up-backend up-frontend
stop: stop-frontend stop-backend
down: down-frontend down-backend

up-backend:
	@make -s -C backend up

up-frontend:
	@make -s -C frontend up

stop-backend:
	@make -s -C backend stop

stop-frontend:
	@make -s -C frontend stop

down-backend:
	@make -s -C backend down

down-frontend:
	@make -s -C frontend down
