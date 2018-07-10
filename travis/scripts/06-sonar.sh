#!/bin/bash

#--------------------------------------------------
# Launch Sonar analysis
#--------------------------------------------------
cd "$APP_FOLDER"
if [ "$SIMLIFE" == "ngx-default" ]; then
    if [ "$TRAVIS_REPO_SLUG" = "simlife/simlife-bot" ] && [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
        ./mvnw clean
        if [ -f "gulpfile.js" ]; then
            gulp test --no-notification
        fi
        if [ -f "tsconfig.json" ]; then
            yarn test
        fi
        ./mvnw org.jacoco:jacoco-maven-plugin:prepare-agent package sonar:sonar -Dsonar.host.url=https://sonarqube.com -Dsonar.login=$SONAR_TOKEN
    fi
fi
