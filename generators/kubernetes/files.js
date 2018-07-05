/**
 * Copyright 2018 the original author or authors from the Simlife project.
 *
 * This file is part of the Simlife project, see https://www.simlife.io/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
    writeFiles
};

function writeFiles() {
    return {
        writeDeployments() {
            for (let i = 0; i < this.appConfigs.length; i++) {
                const appName = this.appConfigs[i].baseName.toLowerCase();
                this.app = this.appConfigs[i];
                this.template('deployment.yml.ejs', `${appName}/${appName}-deployment.yml`);
                this.template('service.yml.ejs', `${appName}/${appName}-service.yml`);
                // If we choose microservice with no DB, it is trying to move _no.yml as prodDatabaseType is getting tagged as 'string' type
                if (this.app.prodDatabaseType !== 'no') {
                    this.template(`db/${this.app.prodDatabaseType}.yml.ejs`, `${appName}/${appName}-${this.app.prodDatabaseType}.yml`);
                }
                if (this.app.searchEngine === 'elasticsearch') {
                    this.template('db/elasticsearch.yml.ejs', `${appName}/${appName}-elasticsearch.yml`);
                }
                if ((this.app.applicationType === 'gateway' || this.app.applicationType === 'monolith') && this.kubernetesServiceType === 'Ingress') {
                    this.template('ingress.yml.ejs', `${appName}/${appName}-ingress.yml`);
                }
                if (!this.app.serviceDiscoveryType && this.app.authenticationType === 'jwt') {
                    this.template('secret/jwt-secret.yml.ejs', `${appName}/jwt-secret.yml`);
                }
                if (this.monitoring === 'prometheus') {
                    this.template('monitoring/simlife-prometheus-sm.yml.ejs', `${appName}/${appName}-prometheus-sm.yml`);
                }
                if (this.istioRoute === true) {
                    this.template('istio/destination-policy.yml.ejs', `${appName}/${appName}-deployment-policy.yml`);
                    this.template('istio/route-rule.yml.ejs', `${appName}/${appName}-route-rule.yml`);
                }
            }
        },

        writeReadme() {
            this.template('README-KUBERNETES.md.ejs', 'README.md');
        },

        writeNamespace() {
            if (this.kubernetesNamespace !== 'default') {
                this.template('namespace.yml.ejs', 'namespace.yml');
            }
        },

        writeMessagingBroker() {
            if (!this.useKafka) return;
            this.template('messagebroker/kafka.yml.ejs', 'messagebroker/kafka.yml');
        },

        writeSimlifeConsole() {
            if (this.monitoring === 'elk') {
                this.template('console/simlife-elasticsearch.yml.ejs', 'console/simlife-elasticsearch.yml');
                this.template('console/simlife-logstash.yml.ejs', 'console/simlife-logstash.yml');
                this.template('console/simlife-console.yml.ejs', 'console/simlife-console.yml');
                this.template('console/simlife-dashboard-console.yml.ejs', 'console/simlife-dashboard-console.yml');
                if (this.composeApplicationType === 'microservice') {
                    this.template('console/simlife-zipkin.yml.ejs', 'console/simlife-zipkin.yml');
                }
            }
        },

        writePrometheusGrafanaFiles() {
            if (this.monitoring === 'prometheus') {
                this.template('monitoring/simlife-prometheus-crd.yml.ejs', 'monitoring/simlife-prometheus-crd.yml');
                this.template('monitoring/simlife-prometheus-cr.yml.ejs', 'monitoring/simlife-prometheus-cr.yml');
                this.template('monitoring/simlife-grafana.yml.ejs', 'monitoring/simlife-grafana.yml');
                this.template('monitoring/simlife-grafana-dashboard.yml.ejs', 'monitoring/simlife-grafana-dashboard.yml');
            }
        },

        writeRegistryFiles() {
            if (this.serviceDiscoveryType === 'eureka') {
                this.template('registry/simlife-registry.yml.ejs', 'registry/simlife-registry.yml');
                this.template('registry/application-configmap.yml.ejs', 'registry/application-configmap.yml');
            } else if (this.serviceDiscoveryType === 'consul') {
                this.template('registry/consul.yml.ejs', 'registry/consul.yml');
                this.template('registry/consul-config-loader.yml.ejs', 'registry/consul-config-loader.yml');
                this.template('registry/application-configmap.yml.ejs', 'registry/application-configmap.yml');
            }
        },

        writeConfigRunFile() {
            this.template('kubectl-apply.sh.ejs', 'kubectl-apply.sh');
        }
    };
}
