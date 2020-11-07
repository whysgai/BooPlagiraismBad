#!/bin/bash

pm2 startup systemd
cd /vagrant/bpb-front/
npm install
cd /vagrant/
npm install
pm2 start /vagrant/processes.json
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
echo "     scripts/test.sh"