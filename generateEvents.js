const fs = require('fs');


const generateUser = config => {
    return {
        "@context": "http://purl.imsglobal.org/ctx/caliper/v1/Context",
        "eventTime": config.date,
        "@type": "http://purl.imsglobal.org/caliper/v1/SessionEvent",
        "actor": {
            "extensions": {
                "externalId": null
            },
            "id": `demo2-cbl.difference-engine.com/caliper/Person/${config.actorId}`,
            "type": "Person"
        },
        "action": "http://purl.imsglobal.org/vocab/caliper/v1/action#LoggedOut",
        "object": {
            "id": "https://demo2-cbl.difference-engine.com",
            "type": "SoftwareApplication"
        },
        "generated": {
            "@id": "demo2-cbl.difference-engine.com/caliper/Session/170437854",
            "@context": "http://purl.imsglobal.org/ctx/caliper/v1/Context",
            "@type": "http://purl.imsglobal.org/caliper/v1/lis/Session",
            "startedAtTime": config.date,
            "extensions": {
                "authenticationMethod": null
            }
        }
    };
}


// actorId = 43851885
const output = {
  data: []
};
for (var i=0; i < 5; i++) {
    const date = new Date();
    output.data = output.data.concat([generateUser({
        date: new Date(date.setDate(date.getDate() - i)),
        actorId: 50000
    })])
}

//now write it out
fs.writeFileSync('./data.json', JSON.stringify(output, null, 2), 'utf-8'); 



