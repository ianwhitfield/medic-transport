var phonenumbers = require('google-libphonenumber');
var phoneUtil = phonenumbers.phoneUtil;

/**
 * Country code of default region to assume if the phone number is not specified * in international format.  Set to 'ZZ' or null if the phone number is
 * guaranteed to be in international format.
 */ 
var DEFAULT_REGION = 'ZZ';

/**
 * @namespace smsglobal-addresser:
 */
exports.prototype = {
  addressPdu: function(_to, _pdu) {
    var phoneNumber = phoneUtil.parse(_to, DEFAULT_REGION);
    var formattedNumber = phoneUtil.format(
        phoneNumber, phonenumbers.PhoneNumberFormat.E164);
    _pdu.destination_addr = formattedNumber.replace('+', '');
  }
}
