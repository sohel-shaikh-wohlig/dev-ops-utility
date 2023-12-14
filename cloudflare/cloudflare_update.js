const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios')
 
const cloudflareAPI = 'https://api.cloudflare.com/client/v4';
const authToken = 'xxxxxxxx'; // Replace with your API token
const zoneId = 'xxxxx'; // Zone ID of thenewsshield.com
const emailId = 'sohel.shaikh@wohlig.com'   // Email ID Cloudflare
const apiKey = 'xxxxx' // Global API Key

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
        .catch((err) => console.log(err));

    const data = await response;
    
    if (data.success && data.result.length > 0) {
        return data.result[0];
    }else{
        throw new Error(`No DNS record found for name: ${name}`);
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
            const record = await fetchDNSRecordId(row.zone_name,row.name); // Get the record ID by name
            
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
 
            updateDNSRecord(record.id, recordData)
                .then(response => {
                    if (response.success) {
                        console.log(`Record updated: ${row.name}`);
                    } else {
                        console.error(`Failed to update record: ${row.name}`, response.errors);
                    }
                });
        } catch (error) {
            console.error(error.message);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });