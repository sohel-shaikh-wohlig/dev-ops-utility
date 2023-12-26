### Cloudflare
Update DNS records via Script

To run the script 
```
node cloudflare_update.js
```

- Log in to the Cloudflare dashboard and select your account and domain.
- ![On the Overview page (the landing page for your domain), find the API section.]
    (https://github.com/sohel-shaikh-wohlig/dev-ops-utility/assets/110670609/d91cb838-2521-41f9-9bb4-38b07a9fbf43)

- ![The API section contains your Zone ID and Accoun![cf_overview]
t ID. To copy these values for API commands or other tasks, select Click to copy.]![cf_api](https://github.com/sohel-shaikh-wohlig/dev-ops-utility/assets/110670609/1ab66da8-4af1-4297-8e1b-37c40d0d36bd)

- Email ID will the email logined in with Cloudflare

### Create an API token
- From the [Cloudflare dashboard](https://dash.cloudflare.com/login), go to My Profile > API Tokens.
- Select Create Token.
- Select a template from the available API token templates or create a custom token. We use the Edit zone DNS template in the following examples.

- Add or edit the token name to describe why or how the token is used. Templates are prefilled with a token name and permissions.
![Cloudflare Account](https://github.com/sohel-shaikh-wohlig/dev-ops-utility/assets/110670609/9af65ad4-8ec3-46fa-8f21-ef0bd97cf2a7)


- Modify the token’s permissions. After selecting a permissions group (Account, User, or Zone), choose what level of access to grant the token. Most groups offer Edit or Read options. Edit is full CRUDL (create, read, update, delete, list) access, while Read is the read permission and list where appropriate. Refer to the available token permissions for more information.
- Select which resources the token is authorized to access. For example, granting Zone DNS Read access to a zone example.com will allow the token to read DNS records only for that specific zone. Any other zone will return an error for DNS record reads operations. Any other operation on that zone will also return an error.
- Select Continue to summary.
- Review the token summary. Select Edit token to make adjustments. You can also edit a token after creation.![Summary](https://github.com/sohel-shaikh-wohlig/dev-ops-utility/assets/110670609/ef85a80b-06a8-429b-9ac6-818a32ffea5a)
- Select Create Token to generate the token’s secret.
- Copy the secret to a secure place.![API Token](https://github.com/sohel-shaikh-wohlig/dev-ops-utility/assets/110670609/13e7c75c-2392-4b26-b8b7-9826e392081b)


# Confluent KAFKA

Here are the steps need to follow to import Topic in Confluent Clod

Please install Confluent [https://docs.confluent.io/confluent-cli/current/install.html#default-installation](Cloud CLI) and  [https://jqlang.github.io/jq/download/](jq)

```confluent login --save```

Once you are able to login to confluent, fetch your prod Environment ID and Cluster ID by running the below commands (copy and save the env id and cluster id):

```
confluent environment list

confluent environment use env-zggwnd

confluent kafka cluster list
```

You need to change your Environment ID and Cluster ID (line #1 and #2 in the shell file attached) to create a master service account with full access to the cluster. You can give granular access in the future after testing.

Once the line #1 and #2 in the shell file attached is updated, run below commands:

```
chmod +x createServiceAccountconfluent1.sh

 ./createServiceAccountconfluent1.sh  
```

[](createServiceAccountconfluent1.sh file)


Once you run the script , 2 service accounts and 2 keys will get created, one for Kafka and other one for Schema registry. Please copy and save the complete blue highlighted section from output as shown below:


Also, you will see your api keys under your cluster->Api keys section with owner name starting with ***masterSA***

execute the following command to generate Authorization Bearer Token which will be used for POST request to Confluent Cloud 
```
echo -n "<api-key>:<api-secret>" | base64
```

The API Key & API Secret key was generated via createServiceAccountconfluent1.sh shell script


After downloading and extracting the folder run npm i to download the required node modules 
Open createTopic.js file in VS Code Editor and change the following values before running the script

```
const kafkaClusterID = "lkc-xxxx86";
const baseURL = `https://pkc-41p56.asia-south1.gcp.confluent.cloud:443/kafka/v3/clusters/${kafkaClusterID}/topics`; 
```

Navigate to csv_file folder and change the value of tags.csv based on your requirement 
First Column is the Topic Name
Second Column is the Number of Partition
Third Column is the value Retention in milisecond

Save the tags.csv file 

From the root directory of utility execute the following command to execute the script

```
node createTopic.js
```


This command will import all the tags mentioned in tags.csv to Confluent Cloud
