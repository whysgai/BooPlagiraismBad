#!/bin/bash

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y mocha # Required to use test commands in shell
sudo npm install -g npm@latest
sudo npm install -g pm2@latest
sudo npm install -g typescript@latest # Required to run tsc to compile back-end
cd /vagrant/bpb-front/
npm install
sudo pm2 startup systemd
sudo pm2 start /vagrant/bpb-front/node_modules/react-scripts/scripts/start.js --name "bpb-front"
cd /vagrant/
npm install --no-bin-links
rm /vagrant/bpb-back/dist/*
tsc
sudo pm2 start /vagrant/bpb-back/dist/App.js
echo ""
echo "BPB Front-End should be available on: 192.168.33.10:3000"
echo "BPB Back-End should be available on: 192.168.33.10:8080"