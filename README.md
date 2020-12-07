# BPB

BPB is a web-based application intended to allow users to compare submissions of Java programming assignments to determine whether a given submission was likely plagiarized from another submission.

# Getting Started (Vagrant)
* Install [Vagrant](https://www.vagrantup.com/docs/installation) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
Note: On Windows, ensure [Hyper-V is disabled](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)
* Navigate to the BPB repository directory
* Run `vagrant up`
* After a delay, the application should be available at `http://192.168.33.10:3000` in your web browser of choice.

# Getting Started (Manually)
* [Install MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
* Create an empty MongoDB database called 'bpb' (without quotes)
* Export the following environment variables: 
`APIPORT`
`DBCONNECTIONSTRING`
`MAXFILEUPLOADSIZE`
`COMPARISONTHRESHOLD`
`REACT_APP_BPB_SRVADDR` (*Note*: See below for recommended default values for each variable)
* Navigate to `bpb-back/`, run `npm run start`
* Navigate to `bpb-front/`, run `npm run start`

# Required Environment Variables
*APIPORT*

Specifies the port that bpb-back will serve API requests on.

Must match the port value specified in REACT_APP_BPB_SRVADDR (see below)

Example Value: 8080

*DBCONNECTIONSTRING*

Specifies the location of the bpb MongoDB database

Example Value: "mongodb://127.0.0.1:27017/bpb"

*MAXFILEUPLOADSIZE*

Indicates the maximum allowable size for a single submission file upload (in bytes)

Example Value: 5000000

*COMPARISONTHRESHOLD*

Determines similarity sensitivity for individual subtree element comparisons

Comparison information is used to calculate overall sensitivity using the Deckard algorithm.

Example Value: 50 (default)

*REACT_APP_BPB_SRVADDR*

Determines location of the back-end server. Must point to where the back-end is hosted.

Example Value: http://127.0.0.1:8080/

# Scripts
* Run `scripts/reload.sh` to resync files and restart app components in Vagrant
* Run `scripts/test.sh` to execute all tests in the Vagrant environment
* Run `scripts/test_back.sh` to run back-end tests only
* Run `scripts/test_front.sh` to run front-end tests only
* Run `scripts/test_integration.sh` to run integration tests
* Run `scripts/test_all.sh` to run all tests
* Run `scripts.monitor.sh` to monitor running apps and view logs