# whale3

Tested with Glassfish. Should run over any application server, and possibly less.

## Configure
You have to configure the encryption key. Either in `web.xml` or in you own app server install.

With Glassfish:
```
asadmin
set-web-env-entry --name="encryptionKey" --type=java.lang.String --value="E6…" Whale3
list-web-env-entry Whale3
unset-web-env-entry --name="encryptionKey" Whale3
```
