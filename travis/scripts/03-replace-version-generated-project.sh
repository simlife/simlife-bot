#!/bin/bash

if [[ "$SIMLIFE_LIB_BRANCH" == "release" ]]; then
    echo "No need to change version in generated project"
    exit 0
fi

if [[ $SIMLIFE_VERSION == '' ]]; then
    SIMLIFE_VERSION=0.0.0-TRAVIS
fi

# simlife-dependencies.version in generated pom.xml or gradle.properties
cd "$APP_FOLDER"
if [[ -a mvnw ]]; then
    sed -e 's/<simlife-dependencies.version>.*<\/simlife-dependencies.version>/<simlife-dependencies.version>'$SIMLIFE_VERSION'<\/simlife-dependencies.version>/1;' pom.xml > pom.xml.sed
    mv -f pom.xml.sed pom.xml
    cat pom.xml | grep \<simlife-dependencies.version\>

elif [[ -a gradlew ]]; then
    sed -e 's/simlife_dependencies_version=.*/simlife_dependencies_version='$SIMLIFE_VERSION'/1;' gradle.properties > gradle.properties.sed
    mv -f gradle.properties.sed gradle.properties
    cat gradle.properties | grep simlife_dependencies_version=

fi
