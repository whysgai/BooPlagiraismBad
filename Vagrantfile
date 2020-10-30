# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "generic/ubuntu1804"

  config.vm.network "private_network", ip: "192.168.33.10"

  config.vm.provision :file, source: 'bpb-front/', destination: "/home/vagrant/bpb-front"

  config.vm.provision :shell, path: "bootstrap.sh"

  config.vm.provider "virtualbox" do |v|
	    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
	    v.memory = 2048
  		v.cpus = 2
	end
end
