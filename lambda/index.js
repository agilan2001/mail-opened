const {readFileSync} = require('fs');

var img = readFileSync('./empty_image.png');

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: img.toString('base64'),
    };
    return response;
};