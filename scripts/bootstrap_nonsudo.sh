#!/bin/bash

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
pm2 startup systemd
cd /vagrant/bpb-front/
npm install
cd /vagrant/bpb-back/
mkdir /vagrant/bpb-back/dist/ #Deleted by su
npm install

sudo chown -R vagrant:vagrant /home/vagrant/.pm2/
pm2 start /vagrant/scripts/processes.json --env vagrant
pm2 save
echo ""
echo "BPB Front-End should be available at: 192.168.33.10:3000"
echo "BPB Back-End should be available at: 192.168.33.10:8080"
echo "BPB Back-end should be queryable using: "
echo "     curl -X GET http://192.168.33.10:8080/assignments/helloworld"
echo "     curl -X GET http://192.168.33.10:8080/submissions/helloworld"
echo ""
echo "Reload the app and refresh files using:"
echo "     scripts/reload.sh" 
echo "Run all tests using:"
echo "     scripts/test_all.sh"
echo "Run front-end tests using:"
echo "     scripts/test_front.sh"
echo "Run back-end tests using:"
echo "     scripts/test_back.sh"
exit 0
