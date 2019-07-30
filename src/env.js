export function getEnvConfig() {
    const environment = process.env.REACT_APP_SERVER_ENVIRONMENT || 'development';

    const settings = {
        'development': {
            API_URL: 'http://localhost:8000/api/',
            CLIENT_APP_URL: 'http://localhost:3000/'
        },
        'staging': {
            API_URL: 'http://api.staging/api/',
            CLIENT_APP_URL: 'http://staging/'
        },
        'production': {
            API_URL: 'http://api.production/api/',
            CLIENT_APP_URL: 'http://production/'
        }
    };
    return settings[environment];
}

