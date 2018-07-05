FROM ubuntu:bionic

RUN \
  # configure the "simlife" user
  groupadd simlife && \
  useradd simlife -s /bin/bash -m -g simlife -G sudo && \
  echo 'simlife:simlife' |chpasswd && \
  mkdir /home/simlife/app && \
  # install open-jdk 8
  apt-get update && \
  apt-get install -y openjdk-8-jdk && \
  # install utilities
  apt-get install -y \
    wget \
    curl \
    vim \
    git \
    zip \
    bzip2 \
    fontconfig \
    python \
    g++ \
    build-essential \
  # dependencies required by puppeteer
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils && \
  # install node.js
  curl -sL https://deb.nodesource.com/setup_8.x | bash && \
  apt-get install -y nodejs && \
  # upgrade npm
  npm install -g npm && \
  # install yarn
  npm install -g yarn && \
  su -c "yarn config set prefix /home/simlife/.yarn-global" simlife && \
  # install yeoman
  su -c "yarn global add yo" simlife && \
  # cleanup
  apt-get clean && \
  rm -rf \
    /home/simlife/.cache/ \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

# copy sources
COPY . /home/simlife/simlife-bot

RUN \
  # fix simlife user permissions
  chown -R simlife:simlife \
    /home/simlife \
    /usr/lib/node_modules && \
  # install simlife
  rm -Rf /home/simlife/simlife-bot/node_modules \
    /home/simlife/simlife-bot/yarn.lock \
    /home/simlife/simlife-bot/yarn-error.log && \
  su -c "cd /home/simlife/simlife-bot && yarn install" simlife && \
  su -c "yarn global add file:/home/simlife/simlife-bot" simlife && \
  # cleanup
  rm -rf \
    /home/simlife/.cache/ \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

# expose the working directory, the Tomcat port, the BrowserSync ports
USER simlife
ENV PATH $PATH:/usr/bin:/home/simlife/.yarn-global/bin:/home/simlife/.yarn/bin:/home/simlife/.config/yarn/global/node_modules/.bin
WORKDIR "/home/simlife/app"
VOLUME ["/home/simlife/app"]
EXPOSE 8080 9000 3001
CMD ["tail", "-f", "/home/simlife/simlife-bot/generators/server/templates/src/main/resources/banner-no-color.txt"]
