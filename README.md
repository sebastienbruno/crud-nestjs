# CRUD NestJS

This NestJS API allows you to get informations about barcode through the Open Food Facts API.
The main services are protected by an authentification mode (json web token). 
* The firts step is to register an user (/register). 
* Then you have to log in (/login) with this user. In return of this service you will obtain a token. 
* Finally you can consume with this token the API's services and get informations about product thanks to its barcode (/products/<barcode>). 


## Table of contents

- [Getting Started](#getting-started)
- [Built With](#built-with)
- [Versioning](#versioning)
- [Authors](#authors)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
All of the instructions are used with PowerShell (PSVersion 5.1.19041.610)

### Prerequisities

In order to run the container you'll need docker installed and started.

* [Docker for Windows](https://docs.docker.com/windows/started)
* [Docker for OS X](https://docs.docker.com/mac/started/)
* [Docker for Linux](https://docs.docker.com/linux/started/)

### Usage with docker-compose

Clone the project and start the container
1. <code>git clone https://github.com/sebastienbruno/crud-nestjs.git</code>
2. <code>cd crud-nestjs</code>
3. <code>docker-compose up dev</code>
4. Once the application is running you can visit http://localhost:3000/api (or your env_url:env_port/api) to see the Swagger interface.

### Usage with npm 

Clone the project and start the container
1. <code>git clone https://github.com/sebastienbruno/crud-nestjs.git</code>
2. <code>cd crud-nestjs</code>
3. <code>npm run start:dev</code>
4. Once the application is running you can visit http://localhost:3000/api (or your env_url:env_port/api) to see the Swagger interface.

### Running the tests

* <code>npm run test</code>
* <code>npm run test:e2e</code>

## Built With

* [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
* [Node](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine
* [Npm](https://www.npmjs.com/) - Npm is a package manager
* [Docker](https://www.docker.com/) - Container solution


## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/sebastienbruno/crud-nestjs/tags). 

## Authors

* **Sebastien BRUNO**

## Next features

* Add a logger system
* Add a validation pipe 
* Add user update feature
* Add a caching system for Open Food Fact API
* Add a deployment manifest Kubernetes 
