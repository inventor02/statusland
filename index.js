const express = require('express');
const hbs = require('express-handlebars');
const si = require('systeminformation');

if(process.env.STATUSLAND_PORT != null) {
    const config = require('./config.json');
} else {
    const config = {
        port: process.env.STATUSLAND_PORT
    }
}

const app = express();
const port = config.port;

app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: '/views/pages',
    partialsDir: '/views/partials'
}));

app.get('/', (req, res) => {
    let info = {};

    si.mem()
        .then(data => {
            info['memory'] = (data.used / 1000000000).toFixed(1) + 'GB / ' + (data.total / 1000000000).toFixed(1) + 'GB';

            si.osInfo()
                .then(osData => {
                    info['hostname'] = osData.hostname;
                    info['platform'] = osData.platform;

                    si.currentLoad()
                        .then(loadData => {
                            info['load'] = loadData.currentload.toFixed(1) + '%';

                            info['uptime'] = (si.time().uptime / 3600).toFixed('1') + 'HR';

                            res.render('index', {
                                info: info
                            });
                        })
                        .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
});

app.listen(port);