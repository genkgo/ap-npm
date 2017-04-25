## ap-npm error-status codes
###### 401:
Unauthorized
###### 421:
Something went wrong while creating package.
###### 422: 
Packageversion already exists. (Note: if you publish a package under a custom-tag (like beta with version 1.2.0) then publishing a 'normal' package with version 1.2.0 will fail as they would both be named as the same in the filesystem.);
###### 423:
Packageversion is invalid.
###### 424: 
Something went wrong when trying to delete a package from filesystem.