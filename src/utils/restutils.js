
export const callRestService = (service, method,headers, data) => {
    return new Promise(function (resolve, reject) {
                console.log('process.env.REACT_APP_CLOUD_URL',process.env.REACT_APP_CLOUD_URL);
                fetch( service, {
                
                method: method,
                headers: headers
            })
            .then(response => response.json())
        // });
            
            

    });
}
export default callRestService;