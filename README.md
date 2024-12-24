
## Project setup
1. Npm install
```bash
$ npm install
```
2. create  `.env` file from `.env.example`
3. start rabbit with Docker
```
docker run -d --hostname my-rabbit --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Testing
Make request to `http://localhost:3000/run`. See result in console.