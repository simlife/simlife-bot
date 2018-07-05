#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Functions
#-------------------------------------------------------------------------------
moveEntity() {
    local entity="$1"
    cp "$SIMLIFE_SAMPLES"/.simlife/"$entity".json "$APP_FOLDER"/.simlife/
}

#-------------------------------------------------------------------------------
# Copy entities json
#-------------------------------------------------------------------------------

rm -Rf "$APP_FOLDER"
mkdir -p "$APP_FOLDER"/.simlife/

if [[ ("$SIMLIFE" == *"mongodb"*) || ("$SIMLIFE" == *"couchbase"*) ]]; then
    moveEntity DocumentBankAccount

    moveEntity FieldTestEntity
    moveEntity FieldTestMapstructEntity
    moveEntity FieldTestServiceClassEntity
    moveEntity FieldTestServiceImplEntity
    moveEntity FieldTestInfiniteScrollEntity
    moveEntity FieldTestPagerEntity
    moveEntity FieldTestPaginationEntity

elif [[ "$SIMLIFE" == *"cassandra"* ]]; then
    moveEntity CassBankAccount

    moveEntity CassTestEntity
    moveEntity CassTestMapstructEntity
    moveEntity CassTestServiceClassEntity
    moveEntity CassTestServiceImplEntity

elif [[ "$SIMLIFE" == *"micro"* ]]; then
    moveEntity MicroserviceBankAccount
    moveEntity MicroserviceOperation
    moveEntity MicroserviceLabel

    moveEntity FieldTestEntity
    moveEntity FieldTestMapstructEntity
    moveEntity FieldTestServiceClassEntity
    moveEntity FieldTestServiceImplEntity
    moveEntity FieldTestInfiniteScrollEntity
    moveEntity FieldTestPagerEntity
    moveEntity FieldTestPaginationEntity

elif [[ "$SIMLIFE" == *"react"* ]]; then
    moveEntity BankAccount
    moveEntity Label
    moveEntity Operation

    moveEntity FieldTestEntity
    moveEntity FieldTestMapstructEntity
    moveEntity FieldTestServiceClassEntity
    moveEntity FieldTestServiceImplEntity
    moveEntity FieldTestInfiniteScrollEntity
    moveEntity FieldTestPagerEntity
    moveEntity FieldTestPaginationEntity

    moveEntity EntityWithDTO
    moveEntity EntityWithPagination
    moveEntity EntityWithPaginationAndDTO
    moveEntity EntityWithServiceClass
    moveEntity EntityWithServiceClassAndDTO
    moveEntity EntityWithServiceClassAndPagination
    moveEntity EntityWithServiceClassPaginationAndDTO
    moveEntity EntityWithServiceImpl
    moveEntity EntityWithServiceImplAndDTO
    moveEntity EntityWithServiceImplAndPagination
    moveEntity EntityWithServiceImplPaginationAndDTO

elif [[ "$SIMLIFE" == *"uaa"* ]]; then
    moveEntity FieldTestEntity
    moveEntity FieldTestMapstructEntity
    moveEntity FieldTestServiceClassEntity
    moveEntity FieldTestServiceImplEntity
    moveEntity FieldTestInfiniteScrollEntity
    moveEntity FieldTestPagerEntity
    moveEntity FieldTestPaginationEntity

elif [[ ( "$SIMLIFE" == *"mysql"* ) || ( "$SIMLIFE" == *"psql"* ) ]]; then
    moveEntity BankAccount
    moveEntity Label
    moveEntity Operation
    moveEntity Place
    moveEntity Division

    moveEntity FieldTestEntity
    moveEntity FieldTestMapstructEntity
    moveEntity FieldTestServiceClassEntity
    moveEntity FieldTestServiceImplEntity
    moveEntity FieldTestInfiniteScrollEntity
    moveEntity FieldTestPagerEntity
    moveEntity FieldTestPaginationEntity

    moveEntity TestEntity
    moveEntity TestMapstruct
    moveEntity TestServiceClass
    moveEntity TestServiceImpl
    moveEntity TestInfiniteScroll
    moveEntity TestPager
    moveEntity TestPagination
    moveEntity TestManyToOne
    moveEntity TestManyToMany
    moveEntity TestManyRelPaginDTO
    moveEntity TestOneToOne
    moveEntity TestCustomTableName
    moveEntity TestTwoRelationshipsSameEntity

    moveEntity EntityWithDTO
    moveEntity EntityWithPagination
    moveEntity EntityWithPaginationAndDTO
    moveEntity EntityWithServiceClass
    moveEntity EntityWithServiceClassAndDTO
    moveEntity EntityWithServiceClassAndPagination
    moveEntity EntityWithServiceClassPaginationAndDTO
    moveEntity EntityWithServiceImpl
    moveEntity EntityWithServiceImplAndDTO
    moveEntity EntityWithServiceImplAndPagination
    moveEntity EntityWithServiceImplPaginationAndDTO
else
    moveEntity BankAccount
    moveEntity Label
    moveEntity Operation

    moveEntity FieldTestEntity
    moveEntity FieldTestMapstructEntity
    moveEntity FieldTestServiceClassEntity
    moveEntity FieldTestServiceImplEntity
    moveEntity FieldTestInfiniteScrollEntity
    moveEntity FieldTestPagerEntity
    moveEntity FieldTestPaginationEntity

    moveEntity EntityWithDTO
    moveEntity EntityWithPagination
    moveEntity EntityWithPaginationAndDTO
    moveEntity EntityWithServiceClass
    moveEntity EntityWithServiceClassAndDTO
    moveEntity EntityWithServiceClassAndPagination
    moveEntity EntityWithServiceClassPaginationAndDTO
    moveEntity EntityWithServiceImpl
    moveEntity EntityWithServiceImplAndDTO
    moveEntity EntityWithServiceImplAndPagination
    moveEntity EntityWithServiceImplPaginationAndDTO
fi

ls -l "$APP_FOLDER"/.simlife/
