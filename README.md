### Cloudflare
Update DNS records via Script

To run the script 
```
node cloudflare_update.js
```

- Log in to the Cloudflare dashboard and select your account and domain.
- ![On the Overview page (the landing page for your domain), find the API section.]
    (./assets/cf_overview.png)

- ![The API section contains your Zone ID and Account ID. To copy these values for API commands or other tasks, select Click to copy.]
(https://developers.cloudflare.com/assets/dash-overview-api-close-view_hu572a7389f8c045b87fe9736ab33a46a9_48667_774x772_resize_q75_box_3-9e82aad9.png)

- Email ID will the email logined in with Cloudflare

### Create an API token*
- From the Cloudflare dashboard, go to My Profile > API Tokens.
- Select Create Token.
- Select a template from the available API token templates or create a custom token. We use the Edit zone DNS template in the following examples.
- ![Add or edit the token name to describe why or how the token is used. Templates are prefilled with a token name and permissions.]
(https://developers.cloudflare.com/assets/template-customize_hu694c6aca5016eb316b0478a948ba5e1d_122049_2426x1768_resize_q75_box_3-96d5d790.png)
- Modify the token’s permissions. After selecting a permissions group (Account, User, or Zone), choose what level of access to grant the token. Most groups offer Edit or Read options. Edit is full CRUDL (create, read, update, delete, list) access, while Read is the read permission and list where appropriate. Refer to the available token permissions for more information.
- Select which resources the token is authorized to access. For example, granting Zone DNS Read access to a zone example.com will allow the token to read DNS records only for that specific zone. Any other zone will return an error for DNS record reads operations. Any other operation on that zone will also return an error.
- Select Continue to summary.
- !(Review the token summary. Select Edit token to make adjustments. You can also edit a token after creation.)
(https://developers.cloudflare.com/assets/token-summary_hufee83c8baa1101e68636fb7a13e3b7a3_48980_2260x854_resize_q75_box_3-544fe3f0.png)
- Select Create Token to generate the token’s secret.

### Terraform

Terraform code to created manage resources