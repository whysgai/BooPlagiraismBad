#!/bin/bash
vagrant rsync
echo "Executing back-end integration tests....."
echo ""
vagrant ssh -c '''
    export APIPORT=8081;
    export UPLOADDIRECTORY=/home/vagrant/;
    export DBCONNECTIONSTRING=mongodb://127.0.0.1:27017/bpbtest;
    export MAXFILEUPLOADSIZE=1000;
    export COMPARISONTHRESHOLD=50;
    npm run integration-test --prefix /vagrant/bpb-back/
'''