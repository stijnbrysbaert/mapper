module.exports = {
    bluebike: {
        get_entities: "https://datapiloten.be/bluebike/availabilities.geojson",
        ld: "./public/bluebike.ttl",
        geojson: "./public/bluebike.geojson"
    },
    velo: {
        get_entities: "https://ext-api-gw-p.antwerpen.be/digipolis/sabhdsveloa/v1/entities",
        rml: "./resources/velo.rml.ttl",   
        ld: "./public/velo.ttl",
        yarrrml: "./mappings/mapping_velo.yml"
    },
    endpoint: "https://bluebike-mapper.azurewebsites.net/"
}