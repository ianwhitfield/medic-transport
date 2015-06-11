var smpp = require('smpp');

/**
 * @namespace abstract:
 */
exports.prototype = {

  /**
   * @name initialize:
   *   Perform device-specific or API-specific initialization.
   */
  initialize: function (_options) {

    this._bound = false;

    /*
    this._session = smpp.connect('smsglobal.com', 1775);
    var system_id = 'bzn9z3ar';
    var password = 'AKutYpdy';
    */

    this._session = smpp.connect('localhost', 2775);
    var system_id = 'smppclient1'
    var password = 'password'

    var that = this;
    this._session.bind_transceiver({
        system_id: system_id,
        password: password
    }, function(pdu) {
      if (pdu.command_status == 0) {
        console.log('Successfully bound');
        // Successfully bound
        that._bound = true;
    });

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
   *   false-like if no error occurred). THe `_result` argument will be
   *   an object containing, at a minimum, a single `result` property
   *   set to either `success`, `partial`, or `failure`. A result of
   *   `partial` indicates that the message was too large for a single
   *   message, had to be fragmented, and one or more of the fragments
   *   failed to send properly.
   *
   *   This function should return the driver instance in `this`.
   */
  send: function (_message, _callback) {
    if (!this._bound) {
      console.log('Error, not bound! Something went wrong.');
    }
    session.submit_sm({
        destination_addr: '12345678',
        short_message: 'Hello!'
    }, function(pdu) {
      console.log('Sending callback');
      if (pdu.command_status == 0) {
        console.log('Successfully sent');
        // Message successfully sent
        console.log(pdu.message_id);
      } else {
        console.log('Error status: ', pdu.command_status);
      }
    });

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


