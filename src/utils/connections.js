// import  Connections from '/webpack.config.js'
const Connections = require('Connections');
export const  getServiceDetails=(serviceKey)=>  {
    return new Promise(function (resolve, reject) {
        // fetch('config/connections.json')
        fetch(Connections)
    // $.getJSON("config/connections.json")
    .then(connections=>
        {
            console.log("connections result",connections);
        resolve(connections.filter(function (services) {
            console.log(" Filtering Connections ",services);
            return services.serviceKey == serviceKey;
        }));
       
    });
})
    
}
export default getServiceDetails;