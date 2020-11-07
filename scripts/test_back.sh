#!/bin/bash
vagrant rsync
echo "Executing back-end tests....."
echo ""
vagrant ssh -c 'cd /vagrant;npm run test'
