const os = require('os');

function getIpAddress() {
    let ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
        let iface = ifaces[dev];
        for (let i = 0; i < iface.length; i++) {
            let { family, address, internal } = iface[i];
            if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                if (address) { return address; }
            } else if (address === '127.0.0.1') return '127.0.0.1';
        }
    }
}

const config = {
    name: "MPC Lab",
    favicon: "/favicon.ico",
    logo: "/assets/svg/-logo-light.svg",
    logo_s: "/assets/svg/-logo-light-s.svg",
    background_image: "/assets/img/background.svg",
    path: __dirname,
    version: "2.0",
    hostname: getIpAddress(),
    //hostname: "localhost",
    port: 80,
    startDelay: 3,
    openTestPage: true,
    languages: [
        ["en", "English"],
        ["zh", "简体中文"],
        ["es", "Español"]
    ],
    log: {
        requestsLog: {
            logging: true,
            typ: "combined", /* combined common dev short tiny */
            // interval: "1d",
            onlyError: true,
            maxFiles: 0,
            encoding: "utf-8",
            folderName: "requestsLogs",
            fileName: "errorRequests.log"
        }
    },
    db: {
        auth: `${__dirname}/db/auth`,
        user: `${__dirname}/db/user`,
        articles: `${__dirname}/db/articles`,
    },
    session: {
        secret: 'test-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: false, // cookie
        }
    },
    sendgridApiKey: "" // sendgrid api key
};

module.exports = config;