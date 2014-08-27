/**
 *              ___               __  
 * |__| | \  / |__   |\/| | |\ | |  \ 
 * |  | |  \/  |___  |  | | | \| |__/ 
 *
 * ==================================
 *
 *          Hivetek 2014
 */
var config = require('./config');

var socketio_server = require('socket.io');
var socketio = socketio_server.listen(config.port);
