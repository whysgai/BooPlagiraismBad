<div align="center">

  <h1>BPB</h1>
  
  <p>
	A full-stack Typescript, React.js + Node.js plagiarism analysis application
  </p>

</div>


# Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Usage](#usage)

## About the Project

This application provides a web-based user interface that leverages LSH (Locality Sensitive Hashing) via [TLSH](https://github.com/trendmicro/tlsh) and Abstract Syntax Tree parsing to allow users to compare Java code files and determine if the files are highly similar, i.e. one has been plagiarized from the other.

BPB leverages 

### Tech Stack

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)

### Features

* Upload multiple files as a "Submission" for comparison against prior/existing submissions.
* Determine the likelihood of plagiarism by reviewing a "similarity" score and visual analysis of a comparison across submissions.

### Usage 

This project includes scripts that allow simple setup in a Vagrant virtual environment.

# Getting Started (Vagrant)
* Install [Vagrant](https://www.vagrantup.com/docs/installation) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
Note: On Windows, ensure [Hyper-V is disabled](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)
* Navigate to the BPB repository directory
* Run `vagrant up`
* After a delay, the application should be available at `http://192.168.33.10:3000` in your web browser of choice.

# Scripts (Vagrant)
When using the Vagrant deployment, the following *.sh scripts can be executed from the repository directory (e.g. `sh scripts/reload.sh` while in `bpb/`)
* Run `scripts/reload.sh` to resync files and restart app components in Vagrant
* Run `scripts/test.sh` to execute all tests in the Vagrant environment
* Run `scripts/test_back.sh` to run back-end tests only
* Run `scripts/test_front.sh` to run front-end tests only
* Run `scripts/test_integration.sh` to run integration tests
* Run `scripts/test_all.sh` to run all tests
* Run `scripts/monitor.sh` to monitor running apps and view log

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

Note: all environment variables must be specified as strings

*REACT_APP_BPB_SRVADDR*

Specifies the location of the back-end server. Must point to where the back-end is hosted.

Example Value: http://127.0.0.1:8080/

*APIPORT*

Specifies the port that bpb-back will serve API requests on.

Must match the port value specified in REACT_APP_BPB_SRVADDR (above)

Example Value: 8080

*DBCONNECTIONSTRING*

Specifies the location of the bpb MongoDB database. Must point to where the database is hosted.

Example Value: "mongodb://127.0.0.1:27017/bpb"

*MAXFILEUPLOADSIZE*

Indicates the maximum allowable size for a single submission file upload (in bytes)

Example Value: 5000000

*COMPARISONTHRESHOLD*

Determines similarity sensitivity for individual subtree element comparisons.

Determines whether BPB considers submission subelements to be similar (or not)

Example Value: 120 (default)
