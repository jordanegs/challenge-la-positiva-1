# Documentación de uso

## Requisitos

- Node.js
- Java

## Instalación

Instalar [AWS CLI](https://aws.amazon.com/es/cli/) y luego configurar una cuenta de AWS.

```bash
# Configure sus credenciales:
$ aws configure
# Instalación de Serverless
$ npm install -g serverless
# Instalando dependencias
$ npm install
```

## Ejecución de Serverless

```bash
# Ejecutar en local
$ npm run build && npx serverless offline
```

```bash
# Subir a AWS
$ npm run build && serverless deploy
```
