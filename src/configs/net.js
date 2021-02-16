export default {
    local: {
        servers: {
            api: {
                host: 'localhost',
                port: 3001,
                path: '/game',
                url: '',
            },
            site: {
                host: 'localhost',
                port: 3000,
                url: '',
            },
        },
    },
    uncolored: {
        servers: {
            api: {
                host: 'uncolored.ru',
                port: 3001,
                path: '/game',
                url: '',
            },
            site: {
                host: 'uncolored.ru',
                port: 80,
                url: process.env.PUBLIC_PATH,
            },
        },
    },
}[process.env.CONFIG];
