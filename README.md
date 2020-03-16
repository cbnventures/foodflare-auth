FoodFlare - API Auth Server
============================

[![GitHub Releases](https://img.shields.io/github/v/release/cbnventures/foodflare-auth?style=flat-square&color=blue&sort=semver)](https://github.com/cbnventures/foodflare-auth/releases)
[![GitHub Top Languages](https://img.shields.io/github/languages/top/cbnventures/foodflare-auth?style=flat-square&color=success)](https://github.com/cbnventures/foodflare-auth)
[![GitHub License](https://img.shields.io/github/license/cbnventures/foodflare-auth?style=flat-square&color=yellow)](https://github.com/cbnventures/foodflare-auth/blob/master/LICENSE)
[![Donate via PayPal](https://img.shields.io/badge/donate-paypal-blue?style=flat-square&color=orange)](https://www.paypal.me/cbnventures)

With so many restaurants, coffee shops, and dessert places, choosing one quickly turns into a huge responsibility. Through FoodFlare, these problems go away _fast_. Whether you're hungry or dying to visit a _newly open and hidden in the corner_ kind of coffee shop, this app is for you.

__Not looking to develop FoodFlare? Download it now on the [App Store](https://itunes.apple.com/us/app/foodflare/id1398042619?ls=1&mt=8) and [Google Play](https://play.google.com/store/apps/details?id=io.cbnventures.foodflare).__

Before the initial setup, you will need:
1. A [Yelp](https://www.yelp.com/developers), [Google](https://cloud.google.com), and an [Amazon Web Services](https://aws.amazon.com) account
2. A computer that can run [Node.js](https://nodejs.org) on macOS or Linux OS (preferably)
3. To become a member of [Apple Developer](https://developer.apple.com/programs/) and [Google Play](https://play.google.com/apps/publish/)

## Table of Contents
With FoodFlare re-designed from the bottom up, we've decided to split the old v2 (privately-sourced) project into manageable chunks. Each repository will now have releases of its own.

1. API Auth Server
2. [API Server](https://github.com/cbnventures/foodflare-api)
3. [iOS and Android App](https://github.com/cbnventures/foodflare-app)
4. [Web Application](https://github.com/cbnventures/foodflare-web)

## Instructions (Part 1 of 4)
To keep things going, we will assume that you are running the [latest version of Node.js](https://nodejs.org/en/download/) and have the respective accounts set up and ready to go.

### 1. Setup and Install Node Modules
To start, let's make sure the globally installed packages are updated, and project dependencies installed. If you are using an IDE (Integrated Developer Environment), you may set up types and run the included tests.
```sh
sudo npm update -g && npm install
```

### 2. Generate Cryptographic Certificates
To combat extraneous API requests, the project uses a library called [JSON Web Tokens](https://jwt.io). JWT allows the API to grant users temporary access and optionally includes the requestor's information.

To maximize security, the project is designed to support _only asymmetric algorithms_, in which, a public/private key pair is required to generate a signature for the token.

__For your convenience, use the commands below to quickly create a signature pair.__

| __Signature__ | __Private Key__                                                                 | __Public Key__                                        |
|---------------|---------------------------------------------------------------------------------|-------------------------------------------------------|
| RS256         | `openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048` | `openssl rsa -in private.pem -pubout -out public.pem` |
| ES256         | `openssl ecparam -genkey -name prime256v1 -noout -out private.pem`              | `openssl ec -in private.pem -pubout -out public.pem`  |

__Pick a signature, generate the private key, then the public key.__ Once you have both keys, re-locate the `public.pem` file into the `certs` directory, then keep the `private.pem` file for the [next set of instructions](https://github.com/cbnventures/foodflare-api#instructions-part-2-of-4).

### 3. Environment Variables
This project includes some configuration to help you configure how you want FoodFlare to run. Don't forget to initialize the `.env` file with this command:
```sh
cp .env.sample .env
```

Once the `.env` file is initialized, modify the variables according to the specification below:

| __Variable__    | __Specification__                                                                                                                                                                 | __Accepted Values__                                                                 |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| `JWT_ALGORITHM` | The algorithm JWT uses to read your public key. For example, if you generated an __ES256__ key pair in the previous step, you would type in `ES256`.                              | `RS256`, `RS384`, `RS512`, `ES256`, `ES384`, `ES512`, `PS256`, `PS384`, and `PS512` |
| `JWT_MAX_AGE`   | The maximum allowed age for tokens to still be valid. For example, if a token is set to expire in `15s` and the max-age is set to `30s`, then JWT will accept tokens up to `30s`. | Interpreted with the [zeit/ms](https://github.com/zeit/ms) library.                 |

__NOTE:__ Please be advised, choices you make here may affect the choices for the [next set of instructions](https://github.com/cbnventures/foodflare-api#instructions-part-2-of-4). If you do decide to change it later, don't forget to make the changes here too.

### 4. Setup IAM Credentials
To deploy the server, an IAM user with specified permissions is necessary. Follow the instructions below to create a new user:
1. Visit the [IAM Management Console](https://console.aws.amazon.com/iam/home?region=us-east-1)
2. Under __Access management__, click __Users__
3. Click the __Add user__ button
   - For the user name, type in `claudia`
   - Check __Programmatic access__ for the access type
4. Click the __Next: Permissions__ button
5. Click the __Create group__ button
   - For the Group name, type in `claudia`
   - Then search and enable these policies listed below:
     - `AWSLambdaFullAccess`
     - `IAMFullAccess`
     - `AmazonAPIGatewayAdministrator`
6. Once done, click the __Create group__ button
7. Click these buttons to skip through the setup:
    - __Next: Tags__
    - __Next: Review__
8. Click the __Create user__ button

On this page, you will be able to see the __Access key ID__ and __Secret access key__. Create a file called `credentials` with the keys copied into the content (shown below). Then save it under the `~/.aws` directory.
```
[claudia]
aws_access_key_id = THE_AWS_ACCESS_KEY_ID_HERE
aws_secret_access_key = THE_AWS_SECRET_ACCESS_KEY_HERE
```

### 5. Deploy to Lambda
When the above steps are finalized (and you're ready), run these commands to deploy the server on to Lambda:
```sh
npm run create && npm run set-version
```

__NOTE:__ The `create` command will upload your project into the development stage. Once the development version is working for you, the `set-version` will push the working copy into production.
