#!/bin/bash
vagrant ssh -c 'rm -f /vagrant/bpb-back/uploads/README.md'
echo "Uploading README.md file from bpb/README.md..."
echo "NOTE: If this fails, ensure you are in the bpb/ directory before executing this script."
echo ""
curl -X POST -F 'submissionfile=@README.md' http://192.168.33.10:8080/submissions/upload
echo ""
echo ""
echo "Contents of file on server:"
echo ""
vagrant ssh -c 'cat /vagrant/bpb-back/uploads/README.md'
