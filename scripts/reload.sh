#!/bin/bash
vagrant rsync
vagrant ssh -c 'pm2 reload all --update-env' 
