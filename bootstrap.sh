#!/bin/bash

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y mocha # Required to use test commands in shell
sudo npm install -g npm@latest
sudo npm install -g pm2@latest
sudo npm install -g typescript@latest # Required to run tsc to compile back-end
rm -r /vagrant/bpb-back/dist/* # Remove any previously compiled back-end files in dist

cd /vagrant/bpb-front/
npm install --no-bin-links
cd /vagrant/
npm install --no-bin-links

sudo chown vagrant:vagrant /home/vagrant/.pm2/rpc.sock /home/vagrant/.pm2/pub.sock

exit 0