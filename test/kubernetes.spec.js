/* global describe, beforeEach, it */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fse = require('fs-extra');

const expectedFiles = {
    eurekaregistry: [
        './registry/simlife-registry.yml',
        './registry/application-configmap.yml'
    ],
    consulregistry: [
        './registry/consul.yml',
        './registry/consul-config-loader.yml',
        './registry/application-configmap.yml'
    ],
    jhgate: [
        './jhgate/jhgate-deployment.yml',
        './jhgate/jhgate-mysql.yml',
        './jhgate/jhgate-service.yml'
    ],
    jhgateingress: [
        './jhgate/jhgate-deployment.yml',
        './jhgate/jhgate-mysql.yml',
        './jhgate/jhgate-service.yml',
        './jhgate/jhgate-ingress.yml'
    ],
    customnamespace: [
        './namespace.yml'
    ],
    jhconsole: [
        './console/simlife-console.yml',
        './console/simlife-elasticsearch.yml',
        './console/simlife-logstash.yml',
        './console/simlife-dashboard-console.yml',
        './console/simlife-zipkin.yml'
    ],
    msmysql: [
        './msmysql/msmysql-deployment.yml',
        './msmysql/msmysql-mysql.yml',
        './msmysql/msmysql-service.yml'
    ],
    mspsql: [
        './mspsql/mspsql-deployment.yml',
        './mspsql/mspsql-postgresql.yml',
        './mspsql/mspsql-service.yml',
        './mspsql/mspsql-elasticsearch.yml'
    ],
    msmongodb: [
        './msmongodb/msmongodb-deployment.yml',
        './msmongodb/msmongodb-mongodb.yml',
        './msmongodb/msmongodb-service.yml'
    ],
    msmariadb: [
        './msmariadb/msmariadb-deployment.yml',
        './msmariadb/msmariadb-mariadb.yml',
        './msmariadb/msmariadb-service.yml'
    ],
    monolith: [
        './samplemysql/samplemysql-deployment.yml',
        './samplemysql/samplemysql-mysql.yml',
        './samplemysql/samplemysql-service.yml',
        './samplemysql/samplemysql-elasticsearch.yml'
    ],
    kafka: [
        './samplekafka/samplekafka-deployment.yml',
        './samplekafka/samplekafka-mysql.yml',
        './samplekafka/samplekafka-service.yml',
        './messagebroker/kafka.yml'
    ],
    prometheusmonit: [
        './monitoring/simlife-prometheus-crd.yml',
        './monitoring/simlife-prometheus-cr.yml',
        './monitoring/simlife-grafana.yml',
        './monitoring/simlife-grafana-dashboard.yml'
    ],
    applyScript: [
        './kubectl-apply.sh'
    ]
};

describe('Simlife Kubernetes Sub Generator', () => {
    describe('only gateway', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '01-gateway'
                    ],
                    adminPassword: 'meetup',
                    dockerRepositoryName: 'simliferepository',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'simlifenamespace',
                    simlifeConsole: false,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('creates expected registry files and content', () => {
            assert.file(expectedFiles.eurekaregistry);
            assert.fileContent('./registry/simlife-registry.yml', /# base64 encoded "meetup"/);
        });
        it('creates expected gateway files and content', () => {
            assert.file(expectedFiles.jhgate);
            assert.fileContent('./jhgate/jhgate-deployment.yml', /image: simliferepository\/jhgate/);
            assert.fileContent('./jhgate/jhgate-deployment.yml', /simlifenamespace.svc.cluster/);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('gateway and mysql microservice', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '01-gateway',
                        '02-mysql'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'default',
                    simlifeConsole: false,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('creates expected registry files', () => {
            assert.file(expectedFiles.eurekaregistry);
        });
        it('creates expected gateway files', () => {
            assert.file(expectedFiles.jhgate);
        });
        it('creates expected mysql files', () => {
            assert.file(expectedFiles.msmysql);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('mysql microservice with custom namespace and simlife-console (with zipkin)', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '02-mysql'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'mynamespace',
                    monitoring: 'elk',
                    simlifeConsole: true,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('creates expected registry files', () => {
            assert.file(expectedFiles.eurekaregistry);
        });
        it('creates expected mysql files', () => {
            assert.file(expectedFiles.msmysql);
        });
        it('creates expected simlife-console files', () => {
            assert.file(expectedFiles.jhconsole);
        });
        it('creates expected namespace file', () => {
            assert.file(expectedFiles.customnamespace);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('gateway and ingress', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '01-gateway'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'default',
                    kubernetesServiceType: 'Ingress',
                    ingressDomain: 'example.com',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('creates expected registry files', () => {
            assert.file(expectedFiles.eurekaregistry);
        });
        it('creates expected gateway files', () => {
            assert.file(expectedFiles.jhgate);
        });
        it('creates expected ingress files', () => {
            assert.file(expectedFiles.jhgateingress);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('MySQL and PostgreSQL microservices without gateway', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '02-mysql',
                        '03-psql'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'default',
                    simlifeConsole: false,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('creates expected registry files', () => {
            assert.file(expectedFiles.eurekaregistry);
        });
        it('doesn\'t creates gateway files', () => {
            assert.noFile(expectedFiles.jhgate);
        });
        it('creates expected mysql files', () => {
            assert.file(expectedFiles.msmysql);
        });
        it('creates expected psql files', () => {
            assert.file(expectedFiles.mspsql);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('gateway, mysql, psql, mongodb, mariadb microservices', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '01-gateway',
                        '02-mysql',
                        '03-psql',
                        '04-mongo',
                        '07-mariadb'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'default',
                    simlifeConsole: false,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('creates expected registry files', () => {
            assert.file(expectedFiles.eurekaregistry);
        });
        it('creates expected gateway files', () => {
            assert.file(expectedFiles.jhgate);
        });
        it('creates expected mysql files', () => {
            assert.file(expectedFiles.msmysql);
        });
        it('creates expected psql files', () => {
            assert.file(expectedFiles.mspsql);
        });
        it('creates expected mongodb files', () => {
            assert.file(expectedFiles.msmongodb);
        });
        it('creates expected mariadb files', () => {
            assert.file(expectedFiles.msmariadb);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('monolith application', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'monolith',
                    directoryPath: './',
                    chosenApps: [
                        '08-monolith'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'default',
                    simlifeConsole: false,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('doesn\'t creates registry files', () => {
            assert.noFile(expectedFiles.eurekaregistry);
        });
        it('creates expected default files', () => {
            assert.file(expectedFiles.monolith);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('Kafka application', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'monolith',
                    directoryPath: './',
                    chosenApps: [
                        '09-kafka'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'default',
                    simlifeConsole: false,
                    kubernetesServiceType: 'LoadBalancer',
                    clusteredDbApps: []
                })
                .on('end', done);
        });
        it('doesn\'t creates registry files', () => {
            assert.noFile(expectedFiles.eurekaregistry);
        });
        it('creates expected default files', () => {
            assert.file(expectedFiles.kafka);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });

    describe('mysql microservice with custom namespace and simlife prometheus monitoring', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/kubernetes'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/compose/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    composeApplicationType: 'microservice',
                    directoryPath: './',
                    chosenApps: [
                        '02-mysql'
                    ],
                    dockerRepositoryName: 'simlife',
                    dockerPushCommand: 'docker push',
                    kubernetesNamespace: 'mynamespace',
                    monitoring: 'prometheus',
                    kubernetesServiceType: 'LoadBalancer'

                })
                .on('end', done);
        });
        it('creates expected registry files', () => {
            assert.file(expectedFiles.eurekaregistry);
        });
        it('creates expected mysql files', () => {
            assert.file(expectedFiles.msmysql);
        });
        it('creates expected prometheus files', () => {
            assert.file(expectedFiles.prometheusmonit);
        });
        it('creates expected namespace file', () => {
            assert.file(expectedFiles.customnamespace);
        });
        it('create the apply script', () => {
            assert.file(expectedFiles.applyScript);
        });
    });
});
