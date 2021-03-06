# holepunch

A commandline tool (cli) and library (node.js api) for making devices
in your home and office Internet-accessible.

Uses UPnP / SSDP and NAT-PMP / ZeroConf (Bonjour) for port forwarding / port mapping.

Works for IPv4 and IPv6 interfaces.

## Status

Published as alpha, but nearing release quality.

```bash
git clone git@github.com:Daplie/holepunch.git

pushd holepunch

node bin/holepunch.js --debug
```

## Install

**Commandline Tool**
```bash
npm install --global holepunch
```

**node.js Library**
```
npm install --save holepunch
```

## Examples

Some examples that work with what's currently published.

### Commandline (CLI)

```bash
holepunch --help
```

```
holepunch --plain-ports 80,65080 --tls-ports 443,65443
```

### API

This is the current Dec 30th api in master

```javascript
var punch = require('holepunch');

punch({
  debug: true
, mappings: [{ internal: 443, external: 443, secure: true }]
, ipifyUrls: ['api.ipify.org'],
, protocols: ['none', 'upnp', 'pmp']
, rvpnConfigs: []
}).then(function (mappings) {
  // be sure to check for an `error` attribute on each mapping
  console.log(mappings);
}, function (err) {
  console.log(err);
});
```

## API (v1.0.0 draft)

TODO: This is the api that I think I'd like to use for the solid v1.0.0

```javascript
punch(opts)

  opts.debug = true | false     // print extra debug info

  opts.mappings = [             // these ports will be tested via tcp / http
    { internal: 80              // the port which is bound locally
    , external: 80              // the port as it is exposed on the internet
    , loopback: true | false    // whether or not to attempt an http(s) loopback test
    , secure: true | false      // (default: true) whether to use tls or plaintext
    }
  ]

  opts.ipifyUrls = [            // ipify urls
    'api.ipify.org'             // default
  ]

  opts.upnp = true | false      // attempt mapping via nat-upnp

  opts.pmp = true | false       // attempt mapping via nat-pmp

  opts.rvpnConfigs = [
    '/etc/holepunch/rvpn.json'  // TODO (not implemented)
  ]
```

## Commandline

TODO `--prebound-ports 22`

```
Usage:
  holepunch.js [OPTIONS] [ARGS]

Options:
      --debug BOOLEAN       show traces and logs

      --plain-ports STRING  Port numbers to test with plaintext loopback.
                            (default: 65080)
                            (formats: <port>,<internal:external>)

      --tls-ports STRING    Port numbers to test with tls loopback.
                            (default: null)

      --ipify-urls STRING   Comma separated list of URLs to test for external ip.
                            (default: api.ipify.org)

      --protocols STRING    Comma separated list of ip mapping protocols.
                            (default: none,upnp,pmp)

      --rvpn-configs STRING Comma separated list of Reverse VPN config files in
                            the order they should be tried. (default: null)

  -h, --help                Display help and usage details
```

## Non-Root

You **do not need root** to map ports, but you may need root to test them.

If you're cool with allowing all node programs to bind to privileged ports, try this:

```bash
sudo setcap 'cap_net_bind_service=+ep' /usr/local/bin/node
```

# License

MPL-2.0
