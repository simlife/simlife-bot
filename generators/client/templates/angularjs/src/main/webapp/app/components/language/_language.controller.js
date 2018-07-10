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
        .controller('<%=simPrefixCapitalized%>LanguageController', <%=simPrefixCapitalized%>LanguageController);

    <%=simPrefixCapitalized%>LanguageController.$inject = ['$translate', '<%=simPrefixCapitalized%>LanguageService', 'tmhDynamicLocale'];

    function <%=simPrefixCapitalized%>LanguageController ($translate, <%=simPrefixCapitalized%>LanguageService, tmhDynamicLocale) {
        var vm = this;

        vm.changeLanguage = changeLanguage;
        vm.languages = null;

        <%=simPrefixCapitalized%>LanguageService.getAll().then(function (languages) {
            vm.languages = languages;
        });

        function changeLanguage (languageKey) {
            $translate.use(languageKey);
            tmhDynamicLocale.set(languageKey);
        }
    }
})();
