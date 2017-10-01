(function() {
  'use strict';
  var AWS, _, debug, simpleParser, sns;

  debug = process.env.DEBUG != null;

  _ = require('lodash/core');

  AWS = require('aws-sdk');

  simpleParser = require('mailparser').simpleParser;

  sns = new AWS.SNS();

  exports.handler = function(event, context, callback) {
    _.each(event.Records, function(record) {
      var content, err, error, headers, message;
      try {
        if (debug) {
          console.log(record);
        }
        message = JSON.parse(record.Sns.Message);
        headers = message.mail.commonHeaders;
        content = message.content;
        if (debug) {
          console.log("Headers: " + (JSON.stringify(headers)));
          console.log("Content: " + content);
        }
        return simpleParser(content, function(err, mail) {
          var msg;
          msg = {
            Message: JSON.stringify({
              "default": "Email received from " + (headers.from.join(', ')),
              email: "Email ontvangen\n Van: " + (headers.from.join(', ')) + "\n Aan: " + (headers.to.join(', ')) + "\n Onderwerp: " + headers.subject + "\n\n " + mail.text,
              sms: "Email received from " + (headers.from.join(', '))
            }),
            MessageStructure: 'json',
            Subject: "[Burgerlijst onthaal] " + headers.subject,
            TopicArn: process.env.MAILINGLIST

            /*
            PhoneNumber: 'STRING_VALUE',
            TargetArn: 'STRING_VALUE',
             */
          };
          return sns.publish(msg, callback);
        });
      } catch (error) {
        err = error;
        return callback(err);
      }
    });
  };

}).call(this);
