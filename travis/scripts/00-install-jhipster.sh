#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# List HOME
#-------------------------------------------------------------------------------
ls -al "$HOME"

#-------------------------------------------------------------------------------
# Install Simlife Dependencies and Server-side library
#-------------------------------------------------------------------------------
cd "$HOME"
if [[ "$TRAVIS_REPO_SLUG" == *"/simlife" ]]; then
    echo "TRAVIS_REPO_SLUG=$TRAVIS_REPO_SLUG"
    echo "No need to clone simlife: use local version"

    cd "$TRAVIS_BUILD_DIR"
    ./mvnw clean install -Dgpg.skip=true

elif [[ "$SIMLIFE_LIB_BRANCH" == "release" ]]; then
    echo "No need to clone simlife: use release version"

else
    git clone "$SIMLIFE_LIB_REPO" simlife
    cd simlife
    if [ "$SIMLIFE_LIB_BRANCH" == "latest" ]; then
        LATEST=$(git describe --abbrev=0)
        git checkout -b "$LATEST" "$LATEST"
    elif [ "$SIMLIFE_LIB_BRANCH" != "master" ]; then
        git checkout -b "$SIMLIFE_LIB_BRANCH" origin/"$SIMLIFE_LIB_BRANCH"
    fi
    git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    travis/scripts/00-replace-version-simlife.sh

    ./mvnw clean install -Dgpg.skip=true
    ls -al ~/.m2/repository/io/github/simlife/simlife-framework/
    ls -al ~/.m2/repository/io/github/simlife/simlife-dependencies/
    ls -al ~/.m2/repository/io/github/simlife/simlife-parent/
fi

#-------------------------------------------------------------------------------
# Install Simlife Generator
#-------------------------------------------------------------------------------
cd "$HOME"
if [[ "$TRAVIS_REPO_SLUG" == *"/simlife-bot" ]]; then
    echo "TRAVIS_REPO_SLUG=$TRAVIS_REPO_SLUG"
    echo "No need to clone simlife-bot: use local version"

    cd "$TRAVIS_BUILD_DIR"/
    yarn install
    yarn global add file:"$TRAVIS_BUILD_DIR"
    if [[ "$JHIPSTER" == "" || "$JHIPSTER" == "ngx-default" ]]; then
        yarn test
    fi

elif [[ "$SIMLIFE_BRANCH" == "release" ]]; then
    yarn global add simlife-bot

else
    git clone "$SIMLIFE_REPO" simlife-bot
    cd simlife-bot
    if [ "$SIMLIFE_BRANCH" == "latest" ]; then
        LATEST=$(git describe --abbrev=0)
        git checkout -b "$LATEST" "$LATEST"
    elif [ "$SIMLIFE_BRANCH" != "master" ]; then
        git checkout -b "$SIMLIFE_BRANCH" origin/"$SIMLIFE_BRANCH"
    fi
    git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    yarn install
    yarn global add file:"$HOME"/simlife-bot
fi

#-------------------------------------------------------------------------------
# List HOME
#-------------------------------------------------------------------------------
ls -al "$HOME"
