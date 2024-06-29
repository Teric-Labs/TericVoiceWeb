#!/bin/bash
npm install --force
npm install --legacy-peer-deps
npm cache clean --force
npm install ajv ajv-keywords --save-dev
npm update react-scripts
npm run build
