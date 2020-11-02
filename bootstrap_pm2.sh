#!/bin/bash

pm2 startup systemd
cd /vagrant/bpb-front/
npm install
cd /vagrant/
npm install
pm2 start /vagrant/processes.json
echo ""
echo "BPB Front-End should be available on: 192.168.33.10:3000"
echo "BPB Back-End should be available on: 192.168.33.10:8080"
echo "Reload both processes using:"
echo "     ssh vagrant@192.168.33.10 'pm2 reload all'"
echo "Run (back-end) tests using:"
echo "     ssh vagrant@192.168.33.10 'npm run test --prefix /vagrant'"
echo "Run (front-end) tests using:"
echo "     todo!"