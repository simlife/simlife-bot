#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Force no insight
#-------------------------------------------------------------------------------
if [ "$APP_FOLDER" == "$HOME/app" ]; then
    mkdir -p "$HOME"/.config/configstore/
    cp "$SIMLIFE_TRAVIS"/configstore/*.json "$HOME"/.config/configstore/
fi

#-------------------------------------------------------------------------------
# Generate the project with simlife
#-------------------------------------------------------------------------------
if [[ "$JHIPSTER" == *"uaa"* ]]; then
    mkdir -p "$UAA_APP_FOLDER"
    cp -f "$SIMLIFE_SAMPLES"/uaa/.yo-rc.json "$UAA_APP_FOLDER"/
    cd "$UAA_APP_FOLDER"
    simlife --force --no-insight --with-entities --skip-checks --skip-git --skip-commit-hook
    ls -al "$UAA_APP_FOLDER"
fi

mkdir -p "$APP_FOLDER"
cp -f "$SIMLIFE_SAMPLES"/"$JHIPSTER"/.yo-rc.json "$APP_FOLDER"/
cd "$APP_FOLDER"
simlife --force --no-insight --skip-checks --with-entities --skip-git --skip-commit-hook
ls -al "$APP_FOLDER"
