var smpp = require('smpp');
var path = require('path');
var Q = require('Q');

/**
 * @namespace smpp-driver:
 */
exports.prototype = {
  /**
   * @name loadHelper
   *   Load a helper object from the smpp subdirectory by name.
   */
  loadHelper: function(_helper_name) {
    var helper_name = path.basename(_helper_name, '.js') + '.js';
    var helper_path = path.resolve(__dirname, 'smpp', helper_name);
    var helper = require(helper_path);
    return helper;
  },

  /**
   * @name initialize:
   *   Perform device-specific or API-specific initialization.
   */
  initialize: function (_options) {
    this._splitter = this.loadHelper(_options.splitter || 'smsglobal_splitter');
    this._addresser = this.loadHelper(_options.addresser || 'smsglobal_addresser');

    this._session = new Promise(function(resolve, reject) {
      var session = smpp.connect(
          _options.host || 'localhost',
          _options.port || 2775);
      session.bind_transceiver({
        system_id: _options.system_id || 'smppclient1',
        password: _options.password || 'password'
      }, function(_pdu) {
        if (_pdu.command_status == 0) {
          console.log('Successfully bound');
          // Successfully bound
          resolve(session);
        } else {
          reject(_pdu);
        }
      });
    });
    this._promise = deferred.promise;

    return this;
  },

  /**
   * @name send:
   *   Send a new message. The `_message` argument must be an object,
   *   containing at least a `to` property (set to the phone number or
   *   MSISDN of the intended recipient), and a `content` property
   *   (containing the message body, encoded as utf-8 text).
   *
   *   After the message has been successfully transmitted, the
   *   `_callback(_err, _result)` function will be invoked with two
   *   arguments -- `_err` will be a node.js-style error object (or
   *   false-like if no error occurred). The `_result` argument will be
   *   an object containing, at a minimum, a single `result` property
   *   set to either `success`, `partial`, or `failure`. A result of
   *   `partial` indicates that the message was too large for a single
   *   message, had to be fragmented, and one or more of the fragments
   *   failed to send properly.
   *
   *   This function should return the driver instance in `this`.
   */
  send: function (_message, _callback) {
<<<<<<< HEAD
    this._session.then(function(_session) {
      var pdus_to_send = this._splitter.prototype.createPdus(_message.content);
      pdus_to_send.forEach(
        this._addresser.prototype.addressPdu.bind(this._addresser, _message.to));
      // TODO: There's some sort of SMPP send-multi that we might want to use here.
      for (var i = 0; i < pdus_to_send.length; i++) {
        _session.submit_sm(pdus_to_send[i], function(_recv_pdu) {
          if (_recv_pdu.command_status == 0) {
            // Message successfully sent
            console.log('Successfully sent');
            console.log(_recv_pdu.message_id);
          } else {
            console.log('Error while sending, status: ', _recv_pdu.command_status);
          }
        });
      }
    }.bind(this));
    return this;
  },

  /**
   * @name register_receive_handler:
   *   Ask the driver to invoke `_callback` whenever a message arrives.
   *   The `_handler(_message, _callback)` function will be invoked
   *   for each message received: the `_err` argument is a node.js-style
   *   error object (or false-like if the operation was successful); the
   *   `_message` argument is an object containing at least the `from`,
   *   `timestamp`, and `content` properties; the `_callback(_err)` argument
   *   is a function that must be called by our instansiator once the
   *   message has been safely written to persistent storage. If for some
   *   reason our instansiator cannot accept the message, the function
   *   should still be called, but the `_err` parameter set to a non-null
   *   error object.
   */
  register_receive_handler: function (_handler) {
    // TODO: This definitely doesn't work!

    this._session.then(function(_session) {
      _session.on('deliver_sm', function(_pdu) {
        console.log('Received message: ', _pdu);

        var message = {};
        message.timestamp = Date.now();
        message.from = _pdu.source_addr;
        message.content = _pdu.short_message;

        _handler(message, function(_err) {
          if (!!_err) {
            console.log('An error occurred: ', _err);
          }
        });
      });
    }.bind(this));
    return this;
  },

  /**
   * @name register_error_handler:
   *   Ask the driver to invoke `_handler(_err)` whenever an error occurs
   *   that cannot be attributed to a requested `send` operation. The
   *   `_err` argument will contain a node.js-style error object, and
   *   should never be null.
   */
  register_error_handler: function (_handler) {

    return this;
  },

  /**
   * @name start:
   *   Start any polling and/or watch operations that are required
   *   for this driver instance to function properly. To avoid data
   *   loss, this function *must* be called after you've registered
   *   callback functions via the `register_receive_handler` and
   *   `register_error_handler` methods.
   */
  start: function () {

    return this;
  },

  /**
   * @name stop:
   *   Stop any polling and/or watch operations that are currently
   *   running on behalf of this driver instance.
   */
  stop: function () {
    this._session.then(function(_session) {
      _session.close();
    }.bind(this));

    return this;
  },

  /**
   * @name destroy:
   *   Release any and all resources held by this driver.
   */
  destroy: function () {

    return this.stop();
  }

};


