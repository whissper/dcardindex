var express       = require('express');
var dCardRouter = require('./DCardRouter');

var backend = express();

//to serve static files such as images, CSS files, and JavaScript files
backend.use('/dcard', express.static('frontend'));
//mount route handler
backend.use('/dcard', dCardRouter);

backend.listen(3000, () => {
    console.log('dcard backend is listening on port 3000!');
});