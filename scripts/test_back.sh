#!/bin/bash
vagrant rsync
echo "Executing back-end tests....."
echo ""
vagrant ssh -c 'cd /vagrant/bpb-back;npm run test'
