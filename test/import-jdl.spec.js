/* global describe, before, beforeEach, it */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fse = require('fs-extra');
const constants = require('../generators/generator-constants');

const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;

const entityFiles = [
    `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/Job.java`,
    `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/repository/JobRepository.java`,
    `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/JobResource.java`,
    `${SERVER_TEST_SRC_DIR}com/mycompany/myapp/web/rest/JobResourceIntTest.java`,
];

describe('Simlife generator import jdl', () => {
    describe('imports a JDL model from single file with --json-only flag', () => {
        beforeEach((done) => {
            helpers.run(require.resolve('../generators/import-jdl'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/import-jdl'), dir);
                })
                .withArguments(['jdl.jdl'])
                .withOptions({ 'json-only': true })
                .on('end', done);
        });

        it('creates entity json files', () => {
            assert.file([
                '.simlife/Department.json',
                '.simlife/JobHistory.json',
                '.simlife/Job.json',
                '.simlife/Employee.json',
                '.simlife/Location.json',
                '.simlife/Task.json',
                '.simlife/Country.json',
                '.simlife/Region.json'
            ]);
        });
        it('does not create actual entity files', () => {
            assert.noFile(entityFiles);
        });
    });
    describe('imports a JDL model from single file', () => {
        beforeEach((done) => {
            helpers.run(require.resolve('../generators/import-jdl'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/import-jdl'), dir);
                })
                .withArguments(['jdl.jdl'])
                .on('end', done);
        });

        it('creates entity json files', () => {
            assert.file([
                '.simlife/Department.json',
                '.simlife/JobHistory.json',
                '.simlife/Job.json',
                '.simlife/Employee.json',
                '.simlife/Location.json',
                '.simlife/Task.json',
                '.simlife/Country.json',
                '.simlife/Region.json'
            ]);
        });
        it('creates actual entity files', () => {
            assert.file(entityFiles);
        });
    });
    describe('imports JDL apps and entities', () => {
        before((done) => {
            helpers.run(require.resolve('../generators/import-jdl'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/import-jdl'), dir);
                })
                .withArguments(['apps-and-entities.jdl'])
                .on('end', done);
        });

        it('creates the applications', () => {
            assert.file([
                path.join('myFirstApp', '.yo-rc.json'),
                path.join('mySecondApp', '.yo-rc.json'),
                path.join('myThirdApp', '.yo-rc.json')
            ]);
        });
        it('creates the entities', () => {
            assert.file([
                path.join('myFirstApp', '.simlife', 'A.json'),
                path.join('myFirstApp', '.simlife', 'B.json'),
                path.join('myFirstApp', '.simlife', 'E.json'),
                path.join('myFirstApp', '.simlife', 'F.json'),
                path.join('mySecondApp', '.simlife', 'E.json'),
                path.join('myThirdApp', '.simlife', 'F.json')
            ]);
        });
    });
    describe('imports single app and entities', () => {
        before((done) => {
            helpers.run(require.resolve('../generators/import-jdl'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/import-jdl'), dir);
                })
                .withOptions({ skipInstall: true })
                .withArguments(['single-app-and-entities.jdl'])
                .on('end', done);
        });

        it('creates the application', () => {
            assert.file(['.yo-rc.json']);
        });
        it('creates the entities', () => {
            assert.file([
                path.join('.simlife', 'A.json'),
                path.join('.simlife', 'B.json'),
            ]);
        });
    });
    describe('imports a JDL model from multiple files', () => {
        beforeEach((done) => {
            helpers.run(require.resolve('../generators/import-jdl'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/import-jdl'), dir);
                })
                .withArguments(['jdl.jdl', 'jdl2.jdl', 'jdl-ambiguous.jdl'])
                .on('end', done);
        });

        it('creates entity json files', () => {
            assert.file([
                '.simlife/Department.json',
                '.simlife/JobHistory.json',
                '.simlife/Job.json',
                '.simlife/Employee.json',
                '.simlife/Location.json',
                '.simlife/Task.json',
                '.simlife/Country.json',
                '.simlife/Region.json',
                '.simlife/DepartmentAlt.json',
                '.simlife/JobHistoryAlt.json',
                '.simlife/Listing.json',
                '.simlife/Profile.json',
                '.simlife/WishList.json'
            ]);
        });
        it('creates actual entity files', () => {
            assert.file(entityFiles);
        });
    });
    describe('imports a JDL model which excludes Elasticsearch for a class', () => {
        beforeEach((done) => {
            helpers.run(require.resolve('../generators/import-jdl'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/import-jdl'), dir);
                })
                .withArguments(['search.jdl'])
                .on('end', done);
        });

        it('creates entity json files', () => {
            assert.file([
                '.simlife/WithSearch.json',
                '.simlife/WithoutSearch.json'
            ]);
            assert.fileContent('.simlife/WithoutSearch.json', /"searchEngine": false/);
            assert.file(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/repository/search/WithSearchSearchRepository.java`);
            assert.noFile(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/repository/search/WithoutSearchSearchRepository.java`);
        });
    });
});
