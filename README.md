# A simple mailinglist using AWS Lambda

This is a very simple Lambda function that creates a very simple mailinglist using only AWS services. It's written in Coffeescript.

## Setup
Create a Gruntfile.coffee with these contents:

`
module.exports = (grunt) ->
 grunt.initConfig
  lambda_invoke:
   default:
    options:
     file_name: 'index.js',
     event: 'event.json'
  lambda_deploy:
   default:
     arn: '<ARN-LAMBDA-FUNCTION>'
    options:
     profile: 'burgerlijst-lambda'
     region:  '<AWS-REGION>'
  lambda_package:
   default: {}
  coffee:
   # compile all CoffeeScript files to a single JS file, index.js
   compile:
    files:
     'index.js': 'src/*.coffee'
 grunt.loadNpmTasks('grunt-contrib-coffee')
 grunt.loadNpmTasks('grunt-aws-lambda')
 # simplify packaging and deployment
 grunt.registerTask('package', [ 'coffee', 'lambda_package' ])
 grunt.registerTask('deploy', [ 'package', 'lambda_deploy' ])
 `

 In your Lambda function, create the following environment variables:

 * `MAILINGLIST` (the arn of the SNS distribution list you need to set up)
 * `DEBUG` (optional, if set, will trigger debug-logging events)
