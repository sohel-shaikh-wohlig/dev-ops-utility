const fs = require('fs');
const { parse } = require("csv-parse");

const readDataDNS = async () => {
    const stream = fs.createReadStream('./csv_files/dns.csv')
      .pipe(parse({ delimiter: ',' }));

      let variableList = '';
      let terraformVarsList = '';
      let dnsList = '';

      for await (const r of stream) {
        const variable_name = r[0];
        const variable_value = r[0];

        //variables.tf
        const variable_string = 
        `
            variable "${variable_name}" {
                description = "${variable_name}"
                default     = "${variable_value}"
            }
        `;
        variableList = variableList + variable_string;

        //terraform.tfvars
        const terraformVars = 
        `
            ${variable_name}  = "${variable_value}"
        `;
        terraformVarsList = terraformVarsList + terraformVars;


        //dns.tf
        const dns = 
        `
            resource "google_dns_record_set" "${variable_name}" {
                name         = "\${var.${variable_name}}.\${var.domain}"
                type         = var.record_type_A
                ttl          = var.ttl
                managed_zone = var.managed_zone
                rrdatas      = var.static_ip_external_gw_global_chng
                project      = var.domain_project
            }
        `;
        dnsList = dnsList + dns;

      }

      fs.appendFileSync('./csv_files/variables.tf',variableList);  
      fs.writeFileSync('./csv_files/terraform.tfvars',terraformVarsList);
      fs.writeFileSync('./csv_files/dns.tf',dnsList);      

}

readDataDNS();