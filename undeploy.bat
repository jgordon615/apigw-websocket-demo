set STACK_NAME=aws-websockets-demo
set PROFILE_NAME=jgordon615

call sam delete --stack-name %STACK_NAME% --profile %PROFILE_NAME%
del template-packaged.yaml
