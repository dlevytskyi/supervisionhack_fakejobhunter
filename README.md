# FakeJobHunter!

## Setup the project with docker

- Clone project
- Install docker and docker compose (https://docs.docker.com/compose/install/)
- Run docker compose (web + server + db) (see below)

```
cd server
docker-compose -f ./docker-compose.yml up
```

- Go to webapplication at localhost:4173
- Scrappe Data
- Run ML Model manually (see below, improve in future)

```
cd hunter
install dependencies from requirements.txt
python dbconfig.py train  --to train data set
python dbconfig.py predict --to predict data set
python train_or_predict.py train --to create model
python train_or_predict.py predict --to predict data set
```

- Enjoy webapplication (offer page to see offers and predictions, and csv tools to import/export data from db in csv format)

## Architecture

Components:

- Frontend: ReactJS
- Backend: NodeJS (NestJS)
- Database: Postgres
- Model: Python
