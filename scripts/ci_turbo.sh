#!/bin/bash

default_branch=foobar

git remote set-branches origin $default_branch
git fetch origin $default_branch

if [[ ! -z "$TRAVIS_TAG" ]]
then
    exit 0
fi

changed_files=$(git --no-pager diff --name-only $TRAVIS_COMMIT $(git merge-base $TRAVIS_COMMIT origin/$default_branch))
echo "changed files:"
echo $changed_files
echo

if [[ "$ZDS_TEST_JOB" != "front" ]] && ! echo "$changed_files" | egrep -v "^assets"
then
    # Don't test the backend if only the `/assets/` directory changed
    export ZDS_TEST_JOB="none"
fi
