const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info:{
        title: 'Node.js + Mysql',
        description:'Description'
    },
    host: 'localhost:3000',
    schemes : ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile,endpointsFiles,doc).then(() =>{
    require('./index.js');
})