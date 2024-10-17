const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser to parse JSON bodies


// Create a MySQL connection
//const db = require('./confige/index')


//routes
const countryRoutes = require('./routers/countries');
const cityRoutes = require('./routers/cities');
const ShipmentStatus = require('./routers/shipment_status');
const shipbytype = require('./routers/shipBy');
const productcategory = require('./routers/productCategory');
const booking = require('./routers/booking');
const account = require('./routers/account');
const sender = require('./routers/sender');

// const router = require('./routers/cities');

// Use CORS
app.use(cors());

// Other middleware and routes
app.use(express.json());

app.use(bodyParser.json());

app.use('/countries', countryRoutes);
app.use('/cities', cityRoutes);
app.use('/shipstatus',ShipmentStatus);
app.use('/shipBy',shipbytype);
app.use('/productCategory',productcategory);
app.use('/booking' ,booking);
app.use('/account',account);
app.use('/sender',sender);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// API routes here
// Example CRUD operations
