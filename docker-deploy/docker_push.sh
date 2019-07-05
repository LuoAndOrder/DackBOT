#! /bin/bash
set -e
# Push only if it's not a pull request
if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    if [ "$TRAVIS_BRANCH" == "master" ] ; then
        # Build and push
        docker --version
        pip install --user awscli
        export PATH=$PATH:$HOME/.local/bin
        eval $(aws ecr get-login --no-include-email --region us-west-2)
        docker-compose build
        docker tag "$IMAGE_NAME:latest" "$AWS_URL/$LIVE_APP_NAME:$TRAVIS_COMMIT"
        docker tag "$IMAGE_NAME:latest" "$AWS_URL/$LIVE_APP_NAME:latest"
        docker push "$AWS_URL/$LIVE_APP_NAME:$TRAVIS_COMMIT"
        docker push "$AWS_URL/$LIVE_APP_NAME:latest"
    fi
fi