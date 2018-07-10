/**
 * Copyright 2013-2018 the original author or authors from the Simlife project.
 *
 * This file is part of the Simlife project, see http://www.simlife.tech/
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
const _ = require('lodash');
const chalk = require('chalk');
const BaseGenerator = require('../generator-base');

const constants = require('../generator-constants');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);

        const simlifeVar = this.options.simlifeVar;
        const simlifeFunc = this.options.simlifeFunc;
        if (simlifeVar === undefined || simlifeVar.moduleName === undefined) {
            this.error(chalk.red('This sub-generator must be used by Simlife modules, and the module name is not defined.'));
        }

        this.log(`Composing Simlife configuration with module ${chalk.red(simlifeVar.moduleName)}`);

        this.warning(`${chalk.red('DEPRECATED!')} The Simlife module sub-generator is deprecated.`);
        this.warning(`Please import the ${chalk.yellow('generator-base.js')} using commonJS require or ES2015 import.`);
        this.warning(`See ${chalk.yellow('http://www.simlife.tech/modules/creating-a-module')} for more details.\n`);

        const baseName = this.config.get('baseName');
        const packageName = this.config.get('packageName');
        const packageFolder = this.config.get('packageFolder');

        if (!this.options.skipValidation && (baseName === undefined || packageName === undefined)) {
            this.log(chalk.red('ERROR! There is no existing Simlife configuration file in this directory.'));
            this.error(`Simlife ${simlifeVar.moduleName} is a Simlife module, and needs a .yo-rc.json configuration file made by Simlife.`);
        }
        // add required Simlife variables
        simlifeVar.baseName = this.baseName = baseName;
        simlifeVar.packageName = packageName;
        simlifeVar.packageFolder = packageFolder;

        simlifeVar.simlifeConfig = this.config.getAll();
        simlifeVar.applicationType = this.config.get('applicationType');
        simlifeVar.authenticationType = this.config.get('authenticationType');
        simlifeVar.cacheProvider = this.config.get('cacheProvider') || this.config.get('hibernateCache') || 'no';
        simlifeVar.enableHibernateCache = this.config.get('enableHibernateCache') || (this.config.get('hibernateCache') !== undefined && this.config.get('hibernateCache') !== 'no');
        simlifeVar.websocket = this.config.get('websocket');
        simlifeVar.databaseType = this.config.get('databaseType');
        simlifeVar.devDatabaseType = this.config.get('devDatabaseType');
        simlifeVar.prodDatabaseType = this.config.get('prodDatabaseType');
        simlifeVar.searchEngine = this.config.get('searchEngine');
        simlifeVar.useSass = this.config.get('useSass');
        simlifeVar.buildTool = this.config.get('buildTool');
        simlifeVar.enableTranslation = this.config.get('enableTranslation');
        simlifeVar.nativeLanguage = this.config.get('nativeLanguage');
        simlifeVar.languages = this.config.get('languages');
        simlifeVar.enableSocialSignIn = this.config.get('enableSocialSignIn');
        simlifeVar.testFrameworks = this.config.get('testFrameworks');
        simlifeVar.enableSwaggerCodegen = this.config.get('enableSwaggerCodegen');
        simlifeVar.simPrefix = this.config.get('simPrefix');
        simlifeVar.simPrefixCapitalized = _.upperFirst(simlifeVar.simPrefix);
        simlifeVar.simlifeVersion = this.config.get('simlifeVersion');
        simlifeVar.serverPort = this.config.get('serverPort');
        // For backward compatibility
        const clientFramework = this.config.get('clientFramework');
        simlifeVar.clientFramework = clientFramework === 'angularX' ? 'angular2' : clientFramework;
        simlifeVar.clientPackageManager = this.config.get('clientPackageManager');

        simlifeVar.angularAppName = this.getAngularAppName();
        simlifeVar.angular2AppName = this.getAngularXAppName();
        simlifeVar.mainClassName = this.getMainClassName();
        simlifeVar.javaDir = `${constants.SERVER_MAIN_SRC_DIR + packageFolder}/`;
        simlifeVar.resourceDir = constants.SERVER_MAIN_RES_DIR;
        simlifeVar.webappDir = constants.CLIENT_MAIN_SRC_DIR;
        simlifeVar.CONSTANTS = constants;

        // alias fs and log methods so that we can use it in script-base when invoking functions from simlifeFunc context in modules
        simlifeFunc.fs = this.fs;
        simlifeFunc.log = this.log;

        // add common methods from generator-base.js
        simlifeFunc.addSocialButton = this.addSocialButton;
        simlifeFunc.addSocialConnectionFactory = this.addSocialConnectionFactory;
        simlifeFunc.addMavenDependency = this.addMavenDependency;
        simlifeFunc.addMavenDependencyManagement = this.addMavenDependencyManagement;
        simlifeFunc.addMavenPlugin = this.addMavenPlugin;
        simlifeFunc.addGradlePlugin = this.addGradlePlugin;
        simlifeFunc.addGradleDependency = this.addGradleDependency;
        simlifeFunc.addGradleDependencyManagement = this.addGradleDependencyManagement;
        simlifeFunc.addSocialConfiguration = this.addSocialConfiguration;
        simlifeFunc.applyFromGradleScript = this.applyFromGradleScript;
        simlifeFunc.addBowerrcParameter = this.addBowerrcParameter;
        simlifeFunc.addBowerDependency = this.addBowerDependency;
        simlifeFunc.addBowerOverride = this.addBowerOverride;
        simlifeFunc.addNpmDependency = this.addNpmDependency;
        simlifeFunc.addNpmDevDependency = this.addNpmDevDependency;
        simlifeFunc.addNpmScript = this.addNpmScript;
        simlifeFunc.addMainCSSStyle = this.addMainCSSStyle;
        simlifeFunc.addMainSCSSStyle = this.addMainSCSSStyle;
        simlifeFunc.addVendorSCSSStyle = this.addVendorSCSSStyle;
        simlifeFunc.copyExternalAssetsInWebpack = this.copyExternalAssetsInWebpack;
        simlifeFunc.addExternalResourcesToRoot = this.addExternalResourcesToRoot;
        simlifeFunc.addAngularJsModule = this.addAngularJsModule;
        simlifeFunc.addAngularJsInterceptor = this.addAngularJsInterceptor;
        simlifeFunc.addElementToMenu = this.addElementToMenu;
        simlifeFunc.addElementToAdminMenu = this.addElementToAdminMenu;
        simlifeFunc.addEntityToMenu = this.addEntityToMenu;
        simlifeFunc.addEntityToModule = this.addEntityToModule;
        simlifeFunc.addAdminToModule = this.addAdminToModule;
        simlifeFunc.addElementTranslationKey = this.addElementTranslationKey;
        simlifeFunc.addAdminElementTranslationKey = this.addAdminElementTranslationKey;
        simlifeFunc.addGlobalTranslationKey = this.addGlobalTranslationKey;
        simlifeFunc.addTranslationKeyToAllLanguages = this.addTranslationKeyToAllLanguages;
        simlifeFunc.getAllSupportedLanguages = this.getAllSupportedLanguages;
        simlifeFunc.getAllSupportedLanguageOptions = this.getAllSupportedLanguageOptions;
        simlifeFunc.isSupportedLanguage = this.isSupportedLanguage;
        simlifeFunc.getAllInstalledLanguages = this.getAllInstalledLanguages;
        simlifeFunc.addEntityTranslationKey = this.addEntityTranslationKey;
        simlifeFunc.addEntityToEhcache = this.addEntityToEhcache;
        simlifeFunc.addEntryToEhcache = this.addEntryToEhcache;
        simlifeFunc.addChangelogToLiquibase = this.addChangelogToLiquibase;
        simlifeFunc.addConstraintsChangelogToLiquibase = this.addConstraintsChangelogToLiquibase;
        simlifeFunc.addLiquibaseChangelogToMaster = this.addLiquibaseChangelogToMaster;
        simlifeFunc.addColumnToLiquibaseEntityChangeset = this.addColumnToLiquibaseEntityChangeset;
        simlifeFunc.dateFormatForLiquibase = this.dateFormatForLiquibase;
        simlifeFunc.copyI18nFilesByName = this.copyI18nFilesByName;
        simlifeFunc.copyTemplate = this.copyTemplate;
        simlifeFunc.copyHtml = this.processHtml;
        simlifeFunc.processHtml = this.processHtml;
        simlifeFunc.copyJs = this.processJs;
        simlifeFunc.processJs = this.processJs;
        simlifeFunc.rewriteFile = this.rewriteFile;
        simlifeFunc.replaceContent = this.replaceContent;
        simlifeFunc.registerModule = this.registerModule;
        simlifeFunc.stripMargin = this.stripMargin;
        simlifeFunc.updateEntityConfig = this.updateEntityConfig;
        simlifeFunc.getModuleHooks = this.getModuleHooks;
        simlifeFunc.getExistingEntities = this.getExistingEntities;
        simlifeFunc.isJsimlifeVersionLessThan = this.isJsimlifeVersionLessThan;
        simlifeFunc.getTableName = this.getTableName;
        simlifeFunc.getColumnName = this.getColumnName;
        simlifeFunc.getPluralColumnName = this.getPluralColumnName;
        simlifeFunc.getJoinTableName = this.getJoinTableName;
        simlifeFunc.getConstraintName = this.getConstraintName;
        simlifeFunc.error = this.error;
        simlifeFunc.warning = this.warning;
        simlifeFunc.printSimlifeLogo = this.printSimlifeLogo;
        simlifeFunc.checkForNewVersion = this.checkForNewVersion;
        simlifeFunc.getAngularAppName = this.getAngularAppName;
        simlifeFunc.getAngular2AppName = this.angularXAppName;
        simlifeFunc.getMainClassName = this.getMainClassName;
        simlifeFunc.askModuleName = this.askModuleName;
        simlifeFunc.aski18n = this.aski18n;
        simlifeFunc.composeLanguagesSub = this.composeLanguagesSub;
        simlifeFunc.getNumberedQuestion = this.getNumberedQuestion;
        simlifeFunc.buildApplication = this.buildApplication;
        simlifeFunc.writeFilesToDisk = this.writeFilesToDisk;
        simlifeFunc.getEntityJson = this.getEntityJson;
    }

    initializing() {
        const insight = this.insight();
        insight.trackWithEvent('generator', 'modules');

        this.log('Reading the Simlife project configuration for your module');
    }
};
