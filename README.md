# About certUpdater

### What is certUpdater

certUpdater is a node program used to update CDN's certificates on aliyun platform.

### How to use

create config.js, you can copy config.example.js and rename it. Then complete config.js, you can find accessKeyId and secretAccessKey in aliyun's console. domains is a whitelist, only domain in whitelist will be updated.

certUpdater receives two arguments: domain and path of certificates.

```
node index.js example.com /path/of/certificates
```

### Detail

certificates should be placed in /path/of/certificates with names of `fullchain.pem` and `privkey.pem`.

# Example: update CDN's certificates automatically after renewal of certbot

The initial purpose of this project is to update CDN's certificates automatically after certbot(let's encrypt) runs renew commands. I'll show how to make it happen in this example.

### Download and configure it

download source code into path /usr/local/bin, then it should look like /usr/local/bin/certUpdater/xxx. Configure it as it is said above.

### Configure certbot's hook

copy updateAliyunCDNCert into /etc/letsencrypt/renewal-hooks/deploy/. Please ensure it's excutable.

### Log

logs will be saved into /var/log/certUpdater.log, if you want to check whether certUpdater success you can read it.
