# BPB

# Getting Started (Vagrant)
* Install Vagrant and Virtualbox
* Run `vagrant up`

# Getting Started (Manually)
* Install MongoDB
* Export the following environment variables: APIPORT, DBCONNECTIONSTRING, MAXFILEUPLOADSIZE, COMPARISONTHRESHOLD
* in `bpb-back/`, run `npm run start`
* in `bpb-front/`, run `npm run start`

# Required Environment Variables
*APIPORT*

Specifies the port that bpb-back will serve API requests on

Example Value: 8080

*DBCONNECTIONSTRING*

Specifies the location of the bpb MongoDB database

Example Value: "mongodb://127.0.0.1:27017/bpb"

*UPLOADDIRECTORY*

Specifies the directory to which files will be uploaded when sent to the app.
This directory must exist on the filesystem.

Example Value: "/vagrant/bpb-back/uploads/"

*MAXFILEUPLOADSIZE*

Indicates the maximum allowable size for a single submission file upload (in bytes)

Example Value: 5000000

*COMPARISONTHRESHOLD*

Determines similarity sensitivity for individual subtree element comparisons

Comparison information is used to calculate overall sensitivity using the Deckard algorithm.

Example Value: 50 (default)

# Scripts
* Run `scripts/reload.sh` to resync files and restart app components in Vagrant
* Run `scripts/test.sh` to execute all tests in the Vagrant environment
* Run `scripts/test_back.sh` to run back-end tests only
* Run `scripts/test_front.sh` to run front-end tests only
* Run `scripts/test_integration.sh` to run integration tests
* Run `scripts/test_all.sh` to run all tests
* Run `scripts.monitor.sh` to monitor running apps and view logs