const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios')
 
const cloudflareAPI = 'https://api.cloudflare.com/client/v4';
const authToken = 'VJcoieikuVv2MASKYUXbc1HPbh2GblDvb60AAUI'; // Replace with your API token
const zoneId = 'cd8596bd51eMASK8ca8f192f9c7f5a3d'; // Zone ID of thenewsshield.com
const emailId = 'sohel.shaikh@wohlig.com'   // Email ID Cloudflare
const apiKey = 'ec2d5afdb30MASKe9dcacfd3560d4e289ce32' // Global API Key

const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Email': emailId,
    'X-Auth-Key' : apiKey
  }
 
// Function to fetch DNS record ID by name
async function fetchDNSRecordId(zoneName,name) {
    const response = await 
    axios.get(`${cloudflareAPI}/zones/${zoneId}/dns_records?name=${name}.${zoneName}`, 
        { headers : headers })
        .then((res) => {
            const data = res.data
            return data
        })
        .catch((error) => {
            if (error.response) {
                console.error('Server responded with status code:', error.response.status);
                console.error('Response data:', error.response.data);
            }
        });

    const data = await response;
    console.log(data)
    if (data.success && data.result.length > 0) {
        //return data.result[0];
        return { type : "edit", data : data.result[0] };
    }else{
        //throw new Error(`No DNS record found for name: ${name}, creating new DNS record.`);
        console.log(`No DNS record found for name: ${name}, creating new DNS record.`);
        return { type : "create", data : null };
    }
}
//function to create DNS Record
async function createDNSRecord(record){
    console.log(record)
    const response = await 
    axios.post(`${cloudflareAPI}/zones/${zoneId}/dns_records`,record,{ headers : headers })
    .then((res) => {
        return res.data
    })
    .catch((error) => {
        if (error.response) {
            console.error('Server responded with status code:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    });

    const responseData = await response

    if (responseData.success && responseData.result) {
        return responseData
    }else{
        throw new Error(`Error while creating DNS record: ${data.name}`);
    }
}

// Function to update DNS record
async function updateDNSRecord(recordId, data) {
    const response = await 
    axios.put(`${cloudflareAPI}/zones/${zoneId}/dns_records/${recordId}`,data,{ headers : headers })
    .then((res) => {
        return res.data
    })
    .catch((err) => console.log(err));

    const responseData = await response
    console.log(responseData)
    if (responseData.success && responseData.result) {
        return responseData
    }else{
        throw new Error(`Error while updating DNS record: ${data.name}`);
    }

}
 
// Read CSV and update records
fs.createReadStream('./csv_files/cloudflare.csv')
    .pipe(csv())
    .on('data', async (row) => {
        try {
            const responseRecord = await fetchDNSRecordId(row.zone_name,row.name); // Get the record ID by name
            console.log(responseRecord.type)
            if (responseRecord.type === "create") {
                const recordData = {
                    type: row.type,
                    name: row.name,
                    content: row.content,
                    ttl: parseInt(row.ttl),
                    proxied: true
                };
     
                createDNSRecord(recordData)
                    .then(response => {
                        if (response.success) {
                            console.log(`Record created: ${row.name}`);
                        } else {
                            console.error(`Failed to create record: ${row.name}`, response.errors);
                        }
                    }); 
            }
            else if (responseRecord.type === "edit"){
                const record = responseRecord.data;
                console.log(record)
                const type = (row.type) ? row.type : record.type 
                const zone = (row.zone_name) ? row.zone_name : record.zone_name
                const name = (row.name) ? row.name : record.name
                const ttl = (row.ttl) ? row.ttl : record.ttl
    
                const recordData = {
                    type: type,
                    name: `${name}.${zone}`,
                    content: row.content,
                    ttl: parseInt(ttl),
                    proxied: true
                };

                if (type === 'A') {
                    //delete recordData.proxied;
                }
     
                updateDNSRecord(record.id, recordData)
                    .then(response => {
                        if (response.success) {
                            console.log(`Record updated: ${row.name}`);
                        } else {
                            console.error(`Failed to update record: ${row.name}`, response.errors);
                        }
                    });
            }
            else{
                console.log(`Record not found for ${row.name}`)
            }
            
        } catch (error) {
            console.error(error.message);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
