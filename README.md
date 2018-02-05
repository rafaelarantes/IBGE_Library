# IBGE_Library
IBGE Library is data scraping of IBGE library (https://biblioteca.ibge.gov.br/index.php/biblioteca-catalogo) and the results will be recorded in database.

### Installation

Developed in [Node.js](https://nodejs.org/) v6.10.0 and [MongoDB](https://www.mongodb.com/) v3.6


Install the dependencies:

```sh
$ git clone https://github.com/rafaelarantes/IBGE_Library.git
$ cd IBGE_Library
$ npm install
```
You need configure the file `./config/config.json` with your database connection.

Start the server:

```sh
$ node app
```
Your browser will open and you can choice a options for extract data and you can follow everything through the console.
