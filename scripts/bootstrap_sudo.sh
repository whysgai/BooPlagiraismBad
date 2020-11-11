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
sudo rm -rf /vagrant/bpb-back/dist # Remove any previously compiled back-end files in dist

#Set up database service
sudo mv /vagrant/scripts/mongodb.service /lib/systemd/mongodb.service
sudo systemctl enable mongodb

# Set env variable(s)
# To be accessed by react, env variables must include REACT_APP_ prefix
sudo echo "REACT_APP_TESTVAR='Hello, World!'" >> /etc/environment
sudo echo "REACT_APP_CLTADDR='client placeholder address'" >> /etc/environment
sudo echo "REACT_APP_SRVADDR='server placeholder address'" >> /etc/environment

exit 0
