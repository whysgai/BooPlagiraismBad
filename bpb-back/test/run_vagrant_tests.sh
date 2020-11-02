#Usage: Running tests in vagrant venv if vagrant ssh is not working
#Add the below lines to ~/.bashrc on host (creating it if it doesn't exist)

 bpb-test() {
       ssh vagrant@192.168.33.10 'cd /vagrant;npm run test'
  }
~
