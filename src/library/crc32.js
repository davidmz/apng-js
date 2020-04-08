const table = new Uint32Array(256)

for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) !== 0) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  }
  table[i] = c
}

/**
 *
 * @param {Uint8Array} bytes
 * @param {number} start
 * @param {number} length
 * @return {number}
 */
export default function (bytes, start = 0, length = bytes.length - start) {
  let crc = -1
  for (let i = start, l = start + length; i < l; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xFF]
  }
  return crc ^ (-1)
}
