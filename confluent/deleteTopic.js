const fs = require('fs');
const { parse } = require("csv-parse");
const axios = require('axios')

const kafkaClusterID = "lkc-0ddy86";
const accessToken = 'xxxx';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${accessToken}`
  }


//DELETE TOPIC
const readDataForDelete = async () => {
    const stream = fs.createReadStream('./csv_files/tags.csv')
      .pipe(parse({ delimiter: ',' }));
  
    for await (const r of stream) {
      const topic_name = r[0];
      const partitions_count = r[1];
      console.log("Deleting Topic --------> ", topic_name);
  
      const deleteURL = `https://pkc-41p56.asia-south1.gcp.confluent.cloud/kafka/v3/clusters/${kafkaClusterID}/topics/${topic_name}`
      try {
        const response = await axios.delete(
            deleteURL,
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

  readDataForDelete();