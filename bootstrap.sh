#!/bin/bash

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo npm install -g npm@latest
cd /vagrant/bpb-front/
npm install
npm start