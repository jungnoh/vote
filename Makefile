build-app:
	cd app && docker build . -t jungnoh-vote-app
	docker tag jungnoh-vote-app jungnoh-vote-app:latest

build-server:
	cd server && docker build . -t jungnoh-vote-server
	docker tag jungnoh-vote-server jungnoh-vote-server:latest

build-proxy:
	cd proxy && docker build . -t jungnoh-vote-proxy
	docker tag jungnoh-vote-proxy jungnoh-vote-proxy:latest

build: build-app build-server build-proxy

