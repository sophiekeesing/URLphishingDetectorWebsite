SHELL := /bin/bash
.DEFAULT_GOAL := dev

.PHONY: dev install migrate clean

# One command to set up env files, install deps, migrate the database,
# and start both the API and the website. Ctrl+C stops both.
dev: migrate
	@echo ""
	@echo "Chick-Check API    -> http://localhost:4000"
	@echo "Chick-Check website -> http://localhost:4321"
	@echo "(Ctrl+C stops both)"
	@echo ""
	@trap 'kill 0' EXIT INT TERM; \
	npm run dev:server & \
	npm run dev:web & \
	wait

migrate: install server/.env web/.env
	npm run prisma:migrate -w server

install: node_modules

node_modules: package.json web/package.json server/package.json
	npm install
	@touch node_modules

server/.env: server/.env.example
	cp server/.env.example server/.env
	@node -e "\
		const fs = require('fs'); \
		const path = 'server/.env'; \
		const secret = require('crypto').randomBytes(32).toString('hex'); \
		fs.writeFileSync(path, fs.readFileSync(path, 'utf8').replace('replace-with-a-long-random-string', secret)); \
	"
	@echo "Created server/.env with a generated JWT_SECRET."
	@echo "Add Stripe test keys to it if you want billing to work."

web/.env: web/.env.example
	cp web/.env.example web/.env

clean:
	rm -rf node_modules web/node_modules server/node_modules web/dist server/dist
