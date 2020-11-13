#!/bin/bash
vagrant rsync
echo "Executing BPB front-end tests....."
echo ""
vagrant ssh -c 'cd /vagrant/bpb-front;npm run test'
echo "Executing back-end tests....."
echo ""
vagrant ssh -c 'cd /vagrant/bpb-back;npm run test'
echo "Executing integration tests....."
echo ""
sh scripts/test_integration.sh
