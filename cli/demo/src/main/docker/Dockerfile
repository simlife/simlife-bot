FROM openjdk:8-jre-alpine

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    SIMLIFE_SLEEP=0 \
    JAVA_OPTS=""

# Add a simlife user to run our application so that it doesn't need to run as root
RUN adduser -D -s /bin/sh simlife
WORKDIR /home/simlife

ADD entrypoint.sh entrypoint.sh
RUN chmod 755 entrypoint.sh && chown simlife:simlife entrypoint.sh
USER simlife

ADD *.war app.war

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 8080

