#!/bin/bash

brew update
brew install mongodb
mkdir -p ./data/db
mongod --dbpath ./data/db