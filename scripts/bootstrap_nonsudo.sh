#!/bin/bash

pm2 startup systemd
cd /vagrant/bpb-front/
npm install
cd /vagrant/bpb-back/
npm install
pm2 start /vagrant/scripts/processes.json
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