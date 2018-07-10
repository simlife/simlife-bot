<%#
 Copyright 2013-2018 the original author or authors from the Simlife project.

 This file is part of the Simlife project, see http://www.simlife.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
<%_ if (websocket === 'spring-websocket') { _%>
import { <%=simPrefixCapitalized%>TrackerService } from './../shared/tracker/tracker.service';
<%_ } _%>

import { <%=angularXAppName%>SharedModule } from '../shared';
/* simlife-needle-add-admin-module-import - Simlife will add admin modules imports here */

import {
    adminState,
    <%_ if (databaseType !== 'no' && databaseType !== 'cassandra') { _%>
    AuditsComponent,
    <%_ } _%>
    <%_ if (!skipUserManagement) { _%>
    UserMgmtComponent,
    UserDialogComponent,
    UserDeleteDialogComponent,
    UserMgmtDetailComponent,
    UserMgmtDialogComponent,
    UserMgmtDeleteDialogComponent,
    <%_ } _%>
    LogsComponent,
    <%=simPrefixCapitalized%>MetricsMonitoringModalComponent,
    <%=simPrefixCapitalized%>MetricsMonitoringComponent,
    <%=simPrefixCapitalized%>HealthModalComponent,
    <%=simPrefixCapitalized%>HealthCheckComponent,
    <%=simPrefixCapitalized%>ConfigurationComponent,
    <%=simPrefixCapitalized%>DocsComponent,
    <%_ if (databaseType !== 'no' && databaseType !== 'cassandra') { _%>
    AuditsService,
    <%_ } _%>
    <%=simPrefixCapitalized%>ConfigurationService,
    <%=simPrefixCapitalized%>HealthService,
    <%=simPrefixCapitalized%>MetricsService,
    <%_ if (applicationType === 'gateway') { _%>
    GatewayRoutesService,
    <%=simPrefixCapitalized%>GatewayComponent,
    <%_ } _%>
    <%_ if (websocket === 'spring-websocket') { _%>
    <%=simPrefixCapitalized%>TrackerComponent,
    <%_ } _%>
    LogsService,
    <%_ if (!skipUserManagement) { _%>
    UserResolvePagingParams,
    UserResolve,
    UserModalService
    <%_ } _%>
} from './';

@NgModule({
    imports: [
        <%=angularXAppName%>SharedModule,
        RouterModule.forChild(adminState),
        /* simlife-needle-add-admin-module - Simlife will add admin modules here */
    ],
    declarations: [
        <%_ if (databaseType !== 'no' && databaseType !== 'cassandra') { _%>
        AuditsComponent,
        <%_ } _%>
        <%_ if (!skipUserManagement) { _%>
        UserMgmtComponent,
        UserDialogComponent,
        UserDeleteDialogComponent,
        UserMgmtDetailComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        <%_ } _%>
        LogsComponent,
        <%=simPrefixCapitalized%>ConfigurationComponent,
        <%=simPrefixCapitalized%>HealthCheckComponent,
        <%=simPrefixCapitalized%>HealthModalComponent,
        <%=simPrefixCapitalized%>DocsComponent,
        <%_ if (applicationType === 'gateway') { _%>
        <%=simPrefixCapitalized%>GatewayComponent,
        <%_ } _%>
        <%_ if (websocket === 'spring-websocket') { _%>
        <%=simPrefixCapitalized%>TrackerComponent,
        <%_ } _%>
        <%=simPrefixCapitalized%>MetricsMonitoringComponent,
        <%=simPrefixCapitalized%>MetricsMonitoringModalComponent
    ],
    entryComponents: [
        <%_ if (!skipUserManagement) { _%>
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        <%_ } _%>
        <%=simPrefixCapitalized%>HealthModalComponent,
        <%=simPrefixCapitalized%>MetricsMonitoringModalComponent,
    ],
    providers: [
        <%_ if (databaseType !== 'no' && databaseType !== 'cassandra') { _%>
        AuditsService,
        <%_ } _%>
        <%=simPrefixCapitalized%>ConfigurationService,
        <%=simPrefixCapitalized%>HealthService,
        <%=simPrefixCapitalized%>MetricsService,
        <%_ if (applicationType === 'gateway') { _%>
        GatewayRoutesService,
        <%_ } _%>
        LogsService,
        <%_ if (websocket === 'spring-websocket') { _%>
        <%=simPrefixCapitalized%>TrackerService,
        <%_ } _%>
        <%_ if (!skipUserManagement) { _%>
        UserResolvePagingParams,
        UserResolve,
        UserModalService
        <%_ } _%>
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class <%=angularXAppName%>AdminModule {}
