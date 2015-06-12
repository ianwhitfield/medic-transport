var iconv = require('iconv-lite');

// Maximum number of UCS2 characters (2 bytes/char) in a single PDU.
// From http://www.smsglobal.com/smpp-api/
var MAX_UCS2_CHARS = 67;

/**
 * @namespace smsglobal-splitter:
 */
exports.prototype = {
  createPdus: function(_content) {
    var pdus = [];

    // This converts all messages to UCS2, to avoid having to detect if the message
    // could be sent as ASCII or not. A future enhancement would be to detect 
    // ASCII only messages so that more characters per message can be sent.

    // Iterate characters. These may consist of multiple Unicode codepoints for
    // things like emoji or accent marks. This prevents splitting the string in
    // the middle of a surrogate code pair.
    var currentBuffer = new Buffer(0);
    for (var symbol of _content) {
      var symbolBytes = iconv.encode(symbol, 'utf16-be')
      // Note: If symbol bytes has more than 2 bytes, it might break with UCS2?
      // We might want to drop these long characters (e.g. emoji) if it causes
      // problems at the SMPP gateway.
      if ((currentBuffer.length + symbolBytes.length) / 2 > MAX_UCS2_CHARS) {
	pdus.push(this.makePdu(currentBuffer));
	currentBuffer = new Buffer(0);
      }
      currentBuffer = Buffer.concat([currentBuffer, symbolBytes]);
    }
    if (currentBuffer.length) {
      pdus.push(this.makePdu(currentBuffer));
    }

    return pdus;
  },

  makePdu: function(_buffer) {
    return {
      data_coding: 0x08,  // UCS2
      short_message: {
	message: _buffer
      }
    };
  }
}
