export default (options)=>{
    return `\
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <meta name="Description" content="Put your description here.">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <base href="/">
        <title>${options.npm_library_name}</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:500,700&display=swap&text=1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz%20"
              rel="stylesheet">
</head>
<body>
</body>
</html>`
};
