#!/bin/bash

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y mocha # Required to use test commands in shell
sudo apt-get install -y mongodb
sudo npm install -g npm@latest
sudo npm install -g pm2@latest
sudo npm install -g typescript@latest # Required to run tsc to compile back-end
rm -rf /vagrant/bpb-back/dist/* # Remove any previously compiled back-end files in dist
sudo chown vagrant:vagrant /home/vagrant/.pm2/rpc.sock /home/vagrant/.pm2/pub.sock

#Set up database service
sudo mv /vagrant/scripts/mongodb.service /lib/systemd/mongodb.service
sudo systemctl enable mongodb

exit 0