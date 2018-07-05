#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Display environment information like JDK version
#-------------------------------------------------------------------------------
cd "$APP_FOLDER"
if [ -f "mvnw" ]; then
    ./mvnw enforcer:display-info
elif [ -f "gradlew" ]; then
    ./gradlew -v
fi

#-------------------------------------------------------------------------------
# Check Javadoc generation
#-------------------------------------------------------------------------------
if [ -f "mvnw" ]; then
    ./mvnw javadoc:javadoc
elif [ -f "gradlew" ]; then
    ./gradlew javadoc
fi

#-------------------------------------------------------------------------------
# Launch UAA tests
#-------------------------------------------------------------------------------
if [[ "$SIMLIFE" == *"uaa"* ]]; then
    cd "$UAA_APP_FOLDER"
    ./mvnw test
fi

#-------------------------------------------------------------------------------
# Launch tests
#-------------------------------------------------------------------------------
cd "$APP_FOLDER"
if [ -f "mvnw" ]; then
    ./mvnw test \
        -Dlogging.level.org.zalando=OFF \
        -Dlogging.level.io.github.simlife=OFF \
        -Dlogging.level.io.github.simlife.sample=OFF \
        -Dlogging.level.io.github.simlife.travis=OFF
elif [ -f "gradlew" ]; then
    ./gradlew test \
        -Dlogging.level.org.zalando=OFF \
        -Dlogging.level.io.github.simlife=OFF \
        -Dlogging.level.io.github.simlife.sample=OFF \
        -Dlogging.level.io.github.simlife.travis=OFF
fi
if [ -f "tsconfig.json" ]; then
    yarn test
fi
