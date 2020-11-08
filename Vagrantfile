# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 2.2.5"

Vagrant.configure("2") do |config|

  config.vm.box = "generic/ubuntu1804"

  config.vm.network "private_network", ip: "192.168.33.10"
  
  config.vm.synced_folder ".", "/vagrant/", type: "rsync", rsync__auto: true, rsync__exclude: ['*node_modules*']

  config.vm.provision :shell, path: "scripts/bootstrap_sudo.sh"

  config.vm.provision :shell, privileged: false, path: "scripts/bootstrap_nonsudo.sh"

  config.vm.provider "virtualbox" do |v|
	    v.memory = 2048
  		v.cpus = 2
	end

  # Set VM name
  config.vm.define :bpb do |t|
  end
  
end
