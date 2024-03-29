const luxtronik = require("luxtronik2");

const hostIp = "192.168.1.102";
const pump = new luxtronik.createConnection(hostIp, 8889);

function flattenObj(obj, parent, res = {}) {
    for (let key in obj) {
        let propName = parent ? parent + "." + key : key;
        if (typeof obj[key] == "object") {
            flattenObj(obj[key], propName, res);
        } else {
            res[propName] = obj[key];
        }
    }

    return res;
}

module.exports = ({ router, loxberry }) => {
    router.get("/", (req, res) => {
        pump.read(function (err, data) {
            if (err) {
                res.end(err);
                return;
            }

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(flattenObj(data)));
        });
    });

    /**
     * 0 = auto
     * 1 = 2nd heat source
     * 2 = party
     * 3 = holiday
     * 4 = off
     */
    router.get("/heating_operation_mode/:mode", (req, res) => {
        var mode = parseInt(req.params.mode, 10);

        if ([0, 1, 2, 3, 4].includes(mode)) {
            pump.write("heating_operation_mode", mode, function (err, data) {
                if (err) {
                    res.end("error");
                }

                res.end(data);
            });
        } else {
            res.end("invalid mode");
        }
    });

    router.get("/warmwater_operation_mode/:mode", (req, res) => {
        var mode = parseInt(req.params.mode, 10);

        if ([0, 1, 2, 3, 4].includes(mode)) {
            pump.write("warmwater_operation_mode", mode, function (err, data) {
                if (err) {
                    res.end("error");
                }

                res.end(data);
            });
        } else {
            res.end("invalid mode");
        }
    });

    router.get("/cooling_operation_mode/:mode", (req, res) => {
        var mode = parseInt(req.params.mode, 10);

        if ([0, 1, 2, 3, 4].includes(mode)) {
            pump.write("cooling_operation_mode", mode, function (err, data) {
                if (err) {
                    res.end("error");
                }

                res.end(data);
            });
        } else {
            res.end("invalid mode");
        }
    });

    router.get("/warmwater_temperature/:temp", (req, res) => {
        var temp = parseInt(req.params.temp, 10);

        if (temp >= 20 && temp <= 65) {
            pump.write("warmwater_temperature", temp, function (err, data) {
                if (err) {
                    res.end("error");
                }

                res.end(data);
            });
        } else {
            res.end("invalid temp");
        }
    });

    router.get("/heating_temperature/:temp", (req, res) => {
        var temp = parseFloat(req.params.temp);

        if (temp >= -5 && temp <= 5) {
            pump.write("heating_temperature", temp, function (err, data) {
                if (err) {
                    res.end(err);
                }

                res.end(data);
            });
        } else {
            res.end("invalid temp");
        }
    });

    return router;
};
