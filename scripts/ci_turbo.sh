#!/bin/bash

git remote set-branches origin dev
git fetch origin dev

if [[ ! -z "$TRAVIS_TAG" ]]
then
    exit 0
fi

changed_files=$(git --no-pager diff --name-only $TRAVIS_COMMIT $(git merge-base $TRAVIS_COMMIT origin/dev))

if [[ "$ZDS_TEST_JOB" != "front" ]] && ! echo "$changed_files" | egrep -v "^assets"
then
    # Don't test the backend if only the `/assets/` directory changed
    export ZDS_TEST_JOB="none"
fi
