export default ({name, htmljs}) => {

    let html = `\
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <meta name="Description" content="Put your description here.">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <base href="/">
        <title>${name || ''}</title>
        <style>
            html, body {
                font-family: 'Montserrat', BlinkMacSystemFont, -apple-system, Roboto, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                height: 100%;
                margin: 0;
                padding: 0;
                background: var(--x-bg1, #fff);
                -webkit-overflow-scrolling: touch;
                width: 100%;
                display: flex;
                flex-direction: column;
                flex: 1 0 auto;
                align-items: flex-start;
                overflow-x: hidden;
            }
            *, *::before,
            *::after {
                box-sizing: border-box;
             }
        </style>
</head>
<body>
</body>
</html>`;


    if (htmljs) {
        html = `\
export default () => \`
${html}
\`
`;
    }

    return {
        file: htmljs ? (typeof htmljs === 'string' ? htmljs : 'src/html.js') : 'src/index.html',
        content: html
    }
};
