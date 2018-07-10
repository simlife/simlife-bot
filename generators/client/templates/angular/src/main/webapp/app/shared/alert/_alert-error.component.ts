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
import { Component, OnDestroy } from '@angular/core';
<%_ if (enableTranslation) { _%>
import { TranslateService } from '@ngx-translate/core';
<%_ } _%>
import { JhiEventManager, JhiAlertService } from 'ng-simlife';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: '<%= simPrefixDashed %>-alert-error',
    template: `
        <div class="alerts" role="alert">
            <div *ngFor="let alert of alerts"  [ngClass]="{\'alert.position\': true, \'toast\': alert.toast}">
                <ngb-alert *ngIf="alert && alert.type && alert.msg" [type]="alert.type" (close)="alert.close(alerts)">
                    <pre [innerHTML]="alert.msg"></pre>
                </ngb-alert>
            </div>
        </div>`
})
export class <%=simPrefixCapitalized%>AlertErrorComponent implements OnDestroy {

    alerts: any[];
    cleanHttpErrorListener: Subscription;
    // tslint:disable-next-line: no-unused-variable
    constructor(private alertService: JhiAlertService, private eventManager: JhiEventManager<% if (enableTranslation) { %>, private translateService: TranslateService<% } %>) {
        this.alerts = [];

        this.cleanHttpErrorListener = eventManager.subscribe('<%=angularAppName%>.httpError', (response) => {
            let i;
            const httpErrorResponse = response.content;
            switch (httpErrorResponse.status) {
                // connection refused, server not reachable
                case 0:
                    this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
                    break;

                case 400:
                    const arr = httpErrorResponse.headers.keys();
                    let errorHeader = null;
                    let entityKey = null;
                    arr.forEach((entry) => {
                        if (entry.endsWith('app-error')) {
                            errorHeader = httpErrorResponse.headers.get(entry);
                        } else if (entry.endsWith('app-params')) {
                            entityKey = httpErrorResponse.headers.get(entry);
                        }
                    });
                    if (errorHeader) {
                        const entityName = <% if (enableTranslation) { %>translateService.instant('global.menu.entities.' + entityKey)<% }else{ %>entityKey<% } %>;
                        this.addErrorAlert(errorHeader, errorHeader, { entityName });
                    } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.fieldErrors) {
                        const fieldErrors = httpErrorResponse.error.fieldErrors;
                        for (i = 0; i < fieldErrors.length; i++) {
                            const fieldError = fieldErrors[i];
                            // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                            const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                            const fieldName = <% if (enableTranslation) { %>translateService.instant('<%=angularAppName%>.' +
                                fieldError.objectName + '.' + convertedField)<% } else { %>convertedField.charAt(0).toUpperCase() +
                                convertedField.slice(1)<% } %>;
                            this.addErrorAlert(
                                'Error on field "' + fieldName + '"', 'error.' + fieldError.message, { fieldName });
                        }
                    } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
                        this.addErrorAlert(httpErrorResponse.error.message, httpErrorResponse.error.message, httpErrorResponse.error.params);
                    } else {
                        this.addErrorAlert(httpErrorResponse.error);
                    }
                    break;

                case 404:
                    this.addErrorAlert('Not found', 'error.url.not.found');
                    break;

                default:
                    if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
                        this.addErrorAlert(httpErrorResponse.error.message);
                    } else {
                        this.addErrorAlert(httpErrorResponse.error);
                    }
            }
        });
    }

    ngOnDestroy() {
        if (this.cleanHttpErrorListener !== undefined && this.cleanHttpErrorListener !== null) {
            this.eventManager.destroy(this.cleanHttpErrorListener);
            this.alerts = [];
        }
    }

    addErrorAlert(message, key?, data?) {
        <%_ if (enableTranslation) { _%>
        key = (key && key !== null) ? key : message;
        this.alerts.push(
            this.alertService.addAlert(
                {
                    type: 'danger',
                    msg: key,
                    params: data,
                    timeout: 5000,
                    toast: this.alertService.isToast(),
                    scoped: true
                },
                this.alerts
            )
        );
        <%_ } else { _%>
        this.alerts.push(
            this.alertService.addAlert(
                {
                    type: 'danger',
                    msg: message,
                    timeout: 5000,
                    toast: this.alertService.isToast(),
                    scoped: true
                },
                this.alerts
            )
        );
        <%_ } _%>
    }
}
