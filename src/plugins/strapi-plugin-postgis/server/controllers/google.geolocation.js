'use strict';
const axios = require("axios").default
module.exports = {
    async searchGeoLocation(ctx) {
        const key = "AIzaSyBVWpu2fya-T7OpNSuFheFxe32Nc_eXvVg"
        const url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
        console.log(ctx.query);
        const res = await axios.get(url, {
            params: {
                key: key,
                input:ctx.query.s,
                locationbias:"circle:1050000@-25.610111",
                inputtype: "textquery",
                language:"en-AU",
                fields: "formatted_address,name,geometry",
            }
        })
        return res.data;
    }
};