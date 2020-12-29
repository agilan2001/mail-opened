exports.handler = async (event) => {
    const response = {
        headers:{
            'Content-Type':'image/png',
            'Access-Control-Allow-Origin':'*'
        },
        statusCode: 200,
        body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        isBase64Encoded : true
    };
    return response;
};