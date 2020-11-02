# BPB (Team-25)

Add the following entries to `~/.bashrc` or the equivalent to add command shortcuts: 

```
 bpb-test() {
       ssh vagrant@192.168.33.10 'cd /vagrant;npm run test'
  }

 bpb-reload() {
 	   ssh vagrant@192.168.33.10 'pm2 reload all'
 }
```