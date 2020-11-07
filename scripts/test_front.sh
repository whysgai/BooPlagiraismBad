#!/bin/bash
vagrant rsync
echo "Executing front-end tests....."
echo ""
vagrant ssh -c 'cd /vagrant/bpb-front;npm run test'
