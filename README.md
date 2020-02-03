# LCMS Adapter

NodeJS server tool to connect the DRIVER+ Test-Bed to the LCMS (Landelijk Crisis Management Systeem) through the LCMS-API. 

The adapter requires that the DRIVER-EU Apache Kafka-based test-bed is running, either locally or on a webserver. If not, see the [test-bed installation instructions](https://github.com/DRIVER-EU/test-bed) for installing a local version of the test-bed. 

## Installation

```bash
npm i
npm run build
```

## Usage

You can start them in two terminals, or one after the other.

```bash
npm run start # To start the connector. Use CTRL-C to stop it.
```
