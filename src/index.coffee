'use strict'

debug = process.env.DEBUG?

_ = require 'lodash/core'
AWS = require 'aws-sdk'
simpleParser = require('mailparser').simpleParser

sns = new AWS.SNS()

exports.handler = (event, context, callback) ->
   _.each event.Records, (record)->
      try
         console.log record if debug
         message = JSON.parse record.Sns.Message
         headers = message.mail.commonHeaders
         content = message.content
         if debug
            console.log "Headers: #{JSON.stringify(headers)}"
            console.log "Content: #{content}"
         simpleParser content, (err,mail)->
            msg =
               Message: JSON.stringify(
                  default: "Email received from #{headers.from.join(', ')}"
                  email: "Email ontvangen\n
                        Van: #{headers.from.join(', ')}\n
                        Aan: #{headers.to.join(', ')}\n
                        Onderwerp: #{headers.subject}\n\n
                        #{mail.text}
                        "
                  sms: "Email received from #{headers.from.join(', ')}")
               MessageStructure: 'json' # if set to json, "Message" can be an object instead of String
               Subject: "[Burgerlijst onthaal] #{headers.subject}"
               TopicArn: process.env.MAILINGLIST
            sns.publish msg, callback
      catch err
         callback err
   return
