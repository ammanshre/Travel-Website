const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/Auth');
const flightRoutes = require('./routes/Flight');
const hotelRoutes = require('./routes/Hotel');
const citiesRoutes = require('./routes/Cities');
const roomRoutes = require('./routes/Room');
const imageRoutes = require('./routes/Image');
const bookingRoutes = require('./routes/Booking');
const taxiRoutes = require('./routes/Taxi'); // Import taxi routes
const config = require('./config');
const authenticateJWT = require('./middlewares/authenticateJWT');
const City = require('./models/City');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const citiesData = require('./data/cities.json');

// Uncomment the following block to insert city data once
// City.insertMany(citiesData)
//     .then(res => {
//         console.log("Data inserted");  
//         mongoose.connection.close();
//     })
//     .catch(e => {
//         console.log(e);     
//         mongoose.connection.close();
//     });

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Travel App API',
            version: '1.0.0',
            description: 'API Documentation for the Travel App application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(cors()); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/flight', flightRoutes);
app.use('/api/city', citiesRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/taxi', taxiRoutes); // Use taxi routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
