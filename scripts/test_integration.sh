#!/bin/bash
vagrant rsync
echo "Executing back-end integration tests....."
echo ""
vagrant ssh -c '''
    export APIPORT=8081;
    export DBCONNECTIONSTRING=mongodb://127.0.0.1:27017/bpbtest;
    export MAXFILEUPLOADSIZE=300000;
    export COMPARISONTHRESHOLD=50;
    export MAXMATCHESPERFILE=10
    npm run integration-test --prefix /vagrant/bpb-back/
'''