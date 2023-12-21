
const fs = require('fs');
const { parse } = require("csv-parse");
const axios = require('axios')

const kafkaClusterID = "lkc-0ddy86";
const baseURL = `https://pkc-41p56.asia-south1.gcp.confluent.cloud:443/kafka/v3/clusters/${kafkaClusterID}/topics`; 
const accessToken = 'xxxxxxxxxx';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${accessToken}`
  }

const aws_access_key_id = xxxxxxxx
const aws_secret_access_key = xxxxxxxxx

const readData = async () => {
    const stream = fs.createReadStream('./csv_files/tags.csv')
      .pipe(parse({ delimiter: ',' }));
  
    for await (const r of stream) {
      const topic_name = r[0];
      const partitions_count = r[1];
      const retention = r[2];

      console.log("Creating Topic --------> ", topic_name);
  
      try {
        const response = await axios.post(
          baseURL,
          {
            topic_name: topic_name,
            partitions_count: partitions_count,
            configs: [{ name: 'retention.ms', value: retention }],
          },
          { headers: headers }
        );
  
        console.log({
            code : response.status,
            statusText : response.statusText
        });
        
  
      } catch (error) {
        const response = error.response
        console.log({
            code : response.status,
            statusText : response.statusText,
            data : response.data
        });
      }
    }
  };

  readData();
