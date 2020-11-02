#!/bin/bash

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo npm install -g npm@latest
sudo npm install -g pm2@latest
cd /vagrant/bpb-front/
npm install
sudo pm2 startup systemd
sudo pm2 start /vagrant/bpb-front/node_modules/react-scripts/scripts/start.js --name "bpb-front"

