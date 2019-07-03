Invoke-Expression -Command (aws ecr get-login --no-include-email --region ${env:AWS_DEFAULT_REGION})
docker-compose.exe build
docker tag dackbot_dackbot:latest ${env:DACKBOT_ECR_PATH}/dackbot:latest
docker push ${env:DACKBOT_ECR_PATH}/dackbot:latest