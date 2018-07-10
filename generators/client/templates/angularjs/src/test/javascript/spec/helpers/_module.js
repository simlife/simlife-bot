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
beforeEach(module('<%= angularAppName %>'));
/**
 * returns a function whose angular will be replaced
 * with whatever mock was supplied.
 */
function withMockedAngular(mockAngular, fn) {
    return function() {
        var _angular = window.angular;
        window.angular = mockAngular;
        var v = fn.apply(this, arguments);
        window.angular = _angular;
        return v;
    }
}