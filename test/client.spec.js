/* global describe, context, beforeEach, it */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const getFilesForOptions = require('./utils/utils').getFilesForOptions;
const expectedFiles = require('./utils/expected-files');
const angularJsFiles = require('../generators/client/files-angularjs').files;
const angularFiles = require('../generators/client/files-angular').files;
const reactFiles = require('../generators/client/files-react').files;

describe('Simlife client generator', () => {
    describe('generate client with angularjs 1', () => {
        beforeEach((done) => {
            helpers.run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt' })
                .withPrompts({
                    baseName: 'simlife',
                    enableTranslation: true,
                    serviceDiscoveryType: false,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: 'angular1',
                    useSass: true
                })
                .on('end', done);
        });

        it('creates expected files for default configuration for client generator', () => {
            assert.noFile(expectedFiles.server);
            assert.noFile(expectedFiles.maven);
            assert.file(getFilesForOptions(angularJsFiles, {
                useSass: true,
                enableTranslation: true,
                serviceDiscoveryType: false,
                authenticationType: 'jwt',
                testFrameworks: []
            }));
        });
        it('contains clientFramework with angular1 value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "angular1"/);
        });
        it('contains clientPackageManager with yarn value', () => {
            assert.fileContent('.yo-rc.json', /"clientPackageManager": "yarn"/);
        });
    });

    describe('generate client with React', () => {
        beforeEach((done) => {
            helpers.run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt', experimental: true })
                .withPrompts({
                    baseName: 'simlife',
                    serviceDiscoveryType: false,
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: 'react',
                    useSass: true
                })
                .on('end', done);
        });
        it('creates expected files for react configuration for client generator', () => {
            assert.noFile(expectedFiles.maven);
            assert.file(getFilesForOptions(reactFiles, {
                useSass: true,
                enableTranslation: true,
                serviceDiscoveryType: false,
                authenticationType: 'jwt',
                testFrameworks: []
            }));
        });
        it('contains clientFramework with react value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "react"/);
        });
    });

    describe('generate client with Angular 2+', () => {
        beforeEach((done) => {
            helpers.run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt' })
                .withPrompts({
                    baseName: 'simlife',
                    serviceDiscoveryType: false,
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: 'angularX',
                    useSass: true
                })
                .on('end', done);
        });

        it('creates expected files for default configuration for client generator', () => {
            assert.noFile(expectedFiles.server);
            assert.noFile(expectedFiles.maven);
            assert.file(expectedFiles.i18nJson);
            assert.file(getFilesForOptions(angularFiles, {
                useSass: true,
                enableTranslation: true,
                serviceDiscoveryType: false,
                authenticationType: 'jwt',
                testFrameworks: []
            }));
        });
        it('contains clientFramework with angularX value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "angularX"/);
        });
        it('contains clientPackageManager with yarn value', () => {
            assert.fileContent('.yo-rc.json', /"clientPackageManager": "yarn"/);
        });
    });

    describe('generate client with Angular 2+ using npm flag', () => {
        beforeEach((done) => {
            helpers.run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt', npm: true })
                .withPrompts({
                    baseName: 'simlife',
                    serviceDiscoveryType: false,
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: 'angularX',
                    useSass: true
                })
                .on('end', done);
        });

        it('creates expected files for default configuration for client-2 generator', () => {
            assert.noFile(expectedFiles.server);
            assert.noFile(expectedFiles.maven);
            assert.file(expectedFiles.i18nJson);
            assert.file(getFilesForOptions(angularFiles, {
                useSass: true,
                enableTranslation: true,
                serviceDiscoveryType: false,
                authenticationType: 'jwt',
                testFrameworks: []
            }));
        });
        it('contains clientFramework with angularX value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "angularX"/);
        });
        it('contains clientPackageManager with npm value', () => {
            assert.fileContent('.yo-rc.json', /"clientPackageManager": "npm"/);
        });
    });
});
