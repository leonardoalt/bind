const mnid = require('mnid')

export function checkAddressMNID (addr) {
  if (mnid.isMNID(addr)) {
    return mnid.decode(addr).address
  } else {
    return addr
  }
}
