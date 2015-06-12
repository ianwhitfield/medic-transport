
var driver = require('../lib/driver');

/**
 * @name test_smpp:
 */

var test_smpp = function () {

  var options = {};

  options.splitter = 'smsglobal_splitter';
  options.addresser = 'smsglobal_addresser';

  /*
  options.host = 'smsglobal.com';
  options.port = 1775;
  options.system_id = 'bzn9z3ar';
  options.password = 'AKutYpdy';
  */

  options.host = 'localhost';
  options.port = 2775;
  options.system_id = 'smppclient1';
  options.password = 'password';

  var d = driver.create('smpp', options);

  d.register_receive_handler(function (_message, _callback) {
    console.log('** driver receive: ', JSON.stringify(_message));
    return _callback();
  });

  d.start();

  var message = {
    to: '+15158226442', content: 'This is a test message'
  };

  d.send(message, function (_err) {
    console.log('** sent: ', JSON.stringify(message));
  });

};

test_smpp();

