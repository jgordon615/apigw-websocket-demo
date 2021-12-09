set STACK_NAME=aws-websockets-demo
set PROFILE_NAME=jgordon615
set CF_S3_BUCKET=aws-websockets

call sam --version
call sam package --template-file template.yaml --s3-bucket %CF_S3_BUCKET% --output-template-file template-packaged.yaml --region us-east-2 --profile %PROFILE_NAME%
call sam deploy --template-file template-packaged.yaml --stack-name %STACK_NAME% --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset --region us-east-1 --profile %PROFILE_NAME%
