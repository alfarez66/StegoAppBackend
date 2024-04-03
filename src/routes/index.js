const algoRoutes = require('./algo_routes.js')

module.exports = function(app,db){
    algoRoutes(app,db)
}