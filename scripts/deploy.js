const path = require('path');
const client = require('scp2');
const superagent = require('superagent');

const SSH_USER = process.env.ARGONN_SSH_USER;
const SSH_PASSWORD = process.env.ARGONN_SSH_PASSWORD;
const HTTP_USER = process.env.ARGONN_HTTP_USER;
const HTTP_PASSWORD = process.env.ARGONN_HTTP_PASSWORD;

if (!SSH_USER || !SSH_PASSWORD || !HTTP_USER || !HTTP_PASSWORD) {
    console.error('Please specify the following environment variables:');
    console.error('  - ARGONN_SSH_USER');
    console.error('  - ARGONN_SSH_PASSWORD');
    console.error('  - ARGONN_HTTP_USER');
    console.error('  - ARGONN_HTTP_PASSWORD');
    process.exit(1);
}

const LOCAL_DIR = path.resolve('./dist/');
const REMOTE_URL = `${SSH_USER}:${SSH_PASSWORD}@argonn.me:/var/www/html/argonn/next/`;
const HOOK_URL = 'http://scripts.argonn.me/argonn-update.php';

console.log('Copying files from local /dist folder...');
client.scp(LOCAL_DIR, REMOTE_URL, (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    console.log('Triggering update on server...');
    const authorizationString = `${HTTP_USER}:${HTTP_PASSWORD}`;
    const encodedAuthorizationString = Buffer.from(authorizationString, 'utf-8').toString('base64');
    superagent.get(HOOK_URL)
        .set('Authorization', `Basic ${encodedAuthorizationString}`)
        .then((response) => {
            try {
                if (!response.body.success) {
                    throw new Error('Failed while updating argonn.me, please check your server');
                }
                console.log('Success!');
                process.exit(0);
            } catch (error) {
                console.error(error.message);
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error(`Error ${error.status}: ${error.message}`);
            process.exit(1);
        });
});