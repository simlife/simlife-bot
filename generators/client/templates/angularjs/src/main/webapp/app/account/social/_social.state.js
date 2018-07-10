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
(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('social-register', {
            parent: 'account',
            url: '/social-register/:provider?{success:boolean}',
            data: {
                authorities: [],
                pageTitle: 'social.register.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/account/social/social-register.html',
                    controller: 'SocialRegisterController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('social');
                    return $translate.refresh();
                }]
            }
        })<% if (authenticationType === 'jwt') { %>
        .state('social-auth', {
            parent: 'account',
            url: '/social-auth',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    controller: 'SocialAuthController'
                }
            }
        })<% } %>;
    }
})();