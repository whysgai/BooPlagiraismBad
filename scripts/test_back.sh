#!/bin/bash
vagrant rsync
echo "Executing back-end tests....."
echo ""
vagrant ssh -c '''
    export APIPORT=8081;
    export DBCONNECTIONSTRING=mongodb://127.0.0.1:27017/bpbtest;
    export MAXFILEUPLOADSIZE=1000;
    export COMPARISONTHRESHOLD=200; #Note:some tests depend on this value for branch coverage
    export MAXMATCHESPERFILE=50;
    npm run test --prefix /vagrant/bpb-back/
'''