# Official WhatsApp.pdf

Standard Operating Procedure: Client Marketing Automation Onboarding 
Introduction 
This Standard Operating Procedure (SOP) provides implementation specialists with a definitive, step-by-step guide for onboarding new clients. Its objective is to ensure a consistent, secure, and robust setup of their marketing automation infrastructure, from foundational domain configuration to final system verification. Following this process sequentially is critical for a successful and scalable implementation. 
-------------------------------------------------------------------------------- 
1.0 Foundational Setup: Domain and Business Email Infrastructure 
This foundational stage is of strategic importance. A properly configured domain and email system are the bedrock of a client's professional identity and digital security. The configurations established here directly impact message deliverability, prevent spoofing, and uphold the client's brand reputation across all digital communications. 
1.1 Domain Registration and DNS Access 
The first step is to verify the client's ownership of their primary domain (e.g., clientdomain.com). The specialist must confirm that they have been granted administrative access to the domain registrar (e.g., GoDaddy, Cloudflare). This level of access is non-negotiable, as it is required to add and edit the essential TXT, MX, and CNAME records that govern the domain's services. 
1.2 Google Workspace Provisioning 
With domain access secured, the next step is to provision the client's professional email environment using Google Workspace. 
1. Navigate to admin.google.com to sign up for a new account using the client's primary domain. 
2. Create the primary administrator account for the client (e.g., info@clientdomain.com), generating a secure password. 
3. Securely document the credentials for this administrator account in the designated password manager. 
1.3 DNS Record Configuration for Email Authentication 
To ensure reliable email delivery and protect the client's domain from misuse, four critical DNS records must be configured. 
MX (Mail Exchange): This record directs all incoming email for the domain to Google's mail servers. The setup process involves replacing any existing MX records in the domain's DNS settings with the specific server addresses and priority values provided by Google (e.g., ASPMX.L.GOOGLE.COM, plus the backup hosts). 
SPF (Sender Policy Framework): This record authorizes Google's servers to send emails on behalf of the client's domain, preventing others from doing so. If no SPF record exists, a new TXT record should be created with the value v=spf1 include:_spf.google.com ~all. If an SPF record already exists, it must be modified to include include:_spf.google.com before the final ~all or -all mechanism. 
DKIM (DomainKeys Identified Mail): This record adds a digital signature to outgoing emails, allowing receiving servers to verify that the message was sent from the authorized domain and has not been altered in transit. To set this up, generate a new 
DKIM key within the Google Workspace Admin console (under Apps > Google Workspace > Gmail > Authenticate email), publish the provided CNAME record in the 
domain's DNS, and then activate authentication in the console once the record has propagated. 
DMARC (Domain-based Message Authentication, Reporting, and Conformance): This record instructs receiving email servers on how to handle messages that fail SPF or DKIM checks. A new TXT record should be created at _dmarc.yourdomain.com with a starting policy like v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com. This proactive policy is the cornerstone of protecting the client's brand against phishing attacks and improving their sender reputation. 
Architect's Note: Advanced Email Hardening 
DMARC Policy Escalation: The initial p=none policy is for monitoring only. A formal plan must be documented to escalate this policy to p=quarantine and ultimately p=reject after 2-4 weeks of monitoring reports to ensure no legitimate mail is affected. 
Reputation Monitoring: Verify the client's domain with Google Postmaster Tools to gain visibility into their sender reputation, spam rates, and deliverability issues. 
Enhanced Security (Optional): For enterprise clients, consider implementing MTA-STS and TLS-RPT to enforce encrypted email transport. If a strong DMARC policy is in place 
(p=quarantine or p=reject), BIMI can be configured to display the client's verified logo in recipient inboxes, enhancing brand trust. 
1.4 Final Verification and Access 
The successful completion of this stage is confirmed when the following criteria are met: 
The client's Google Workspace account is active, and the admin user can successfully send and receive emails using the business domain. 
All essential authentication records (MX, SPF, DKIM, and DMARC) are live and correctly configured in the domain's DNS. 
2-Step Verification has been enforced for all administrator accounts within Google Workspace. 
The implementation specialist has been granted the necessary administrative rights within the client's Google Workspace account. 
With the core domain and email infrastructure established and secured, the next step is to legitimize the business on Meta's platform. 
-------------------------------------------------------------------------------- 
2.0 Meta Business Manager Configuration 
A correctly configured Meta Business Manager is a non-negotiable prerequisite for client advertising and, crucially, for gaining access to the WhatsApp Business API. This process establishes the client's official business identity within the Meta ecosystem and formally links their web assets, such as their domain, to their Meta presence. 
2.1 Business Manager Creation and Domain Verification 
Follow these steps to create the Business Manager and verify the client's domain: 
1. Navigate to business.facebook.com to create a new Business account. 2. Enter the client's official legal name, physical address, and business phone number. 3. Add and verify a business email address that is associated with the client's verified 
domain (e.g., info@clientdomain.com). 4. Navigate to Brand Safety > Domains within Business Settings and initiate the domain 
verification process. 5. Copy the TXT record provided by Meta and add it to the domain's DNS settings via the 
registrar. 6. Once the DNS record has had time to propagate, return to the Meta Business Manager 
and click the Verify button. 
2.2 Business Verification Process 
Meta requires formal business verification to unlock access to key features like the WhatsApp API. This involves proving the legitimacy of the client's organization. 
Navigate to the Business Verification Status section under Business info. 
Start the verification wizard and accurately enter the client's legal business details. 
Upload official supporting documents when prompted, such as a certificate of 
incorporation, business license, or tax registration certificate. 
Complete the process and await confirmation from Meta, which can take from minutes to 
several days. 
2.3 Role Assignment and Asset Management 
Proper access control is essential for security and collaboration. In Business Settings > People, add the developer as an Admin. Assign necessary assets, such as the client's Facebook Page and the newly verified domain, to the developer's account. To associate the page, navigate to the verified domain's settings and click Add Assets. It is critical to document that the client remains the primary owner of the Business Manager account. 
2.4 Final Verification 
Confirm the successful completion of this stage with the following checklist: 
The business details in Meta Business Manager are complete and accurate. 
The client's domain has a "Verified" status, indicated by a green dot. 
The formal business verification process has been submitted or, ideally, approved. 
The developer has been granted appropriate admin access to the necessary assets. 
Once the business is verified on Meta's platform, the next step is to connect the WhatsApp communication channel. 
-------------------------------------------------------------------------------- 
3.0 WhatsApp Business API Activation via 360dialog 
360dialog serves as the official Business Solution Provider (BSP) that connects the client's business directly to the WhatsApp Business API (WABA). This section covers the provisioning of the primary messaging channel, which is a crucial link in the automation infrastructure. 
3.1 Account and Phone Number Preparation 
Before initiating the connection, several prerequisites must be met: 
1. Log in to the 360dialog Client Hub. (Note: 360dialog uses both start.360dialog.com for initial onboarding and hub.360dialog.io for ongoing management. Both may be required.) 
2. Procure a dedicated phone number for the service. This number must not be currently active on any consumer or business version of the WhatsApp app. If the number was used previously, the old WhatsApp account associated with it must be fully deleted first. 
3. During the 360dialog onboarding flow, link the new WhatsApp Business Account to the client's verified Meta Business Manager. 
4. After completing the process, confirm that the phone number's status appears as "Connected" within the client's Meta Business Manager settings. 
3.2 API Key Generation and Security 
An API key is required to authenticate all requests to the WhatsApp Business API. Generating and storing this key correctly is a critical security step. 
In the 360dialog Client Hub, navigate to the API Keys section and click Generate API Key. 
Important: This key is displayed only once upon generation. It must be copied immediately and stored in a secure password manager. 
Be aware that generating a new API key will automatically and permanently revoke the previous one, which will break any existing integrations using the old key. 
3.3 Final Verification 
The following criteria confirm that the WhatsApp API connection is ready for use: 
The dedicated WhatsApp phone number is successfully connected to the client's Meta Business Manager. 
A valid 360dialog API key has been generated and is securely stored in the designated password manager. 
The developer has the necessary login credentials for the 360dialog platform. 
Architect's Note: Disaster Recovery Planning 
The API key and webhook configuration represent a critical point of failure. A disaster recovery runbook must be documented that details the exact procedure for rotating a compromised API key. This includes generating a new key, updating the Make.com connection, and immediately re-entering the webhook URL in the 360dialog Hub, as this field is often cleared during key rotation. 
With the API key secured, it's time to configure the automation engine that will use it to send and receive messages. 
-------------------------------------------------------------------------------- 
4.0 Automation Engine Setup with Make.com 
Make.com will serve as the central automation platform where the client's business logic is designed and executed. This section covers the critical steps for connecting all the previously configured systems and establishing the core workflows for handling messages. 
4.1 Establishing the 360dialog Connection 
To enable Make.com to communicate with the WhatsApp API, a secure connection must be established. 
1. Log in to the client's Make.com account and confirm that the developer has been granted administrative rights. 
2. Navigate to the Connections tab and opt to add a new connection. 3. Select the 360dialog WhatsApp Business app from the list of available services. 4. When prompted, paste the securely stored 360dialog API key to authenticate the 
connection. 5. Name the connection clearly (e.g., ClientName 360dialog) to ensure it can be easily 
identified in future scenarios. 
4.2 Configuring the Inbound Message Webhook 
A webhook is the mechanism that allows WhatsApp to send inbound messages to Make.com in real-time. 
1. Create a new scenario in Make.com and add a Custom Webhook module. This will immediately generate a unique URL. 
2. Copy this unique webhook URL to your clipboard. 3. Log in to the 360dialog Hub, navigate to the settings for the connected phone number, 
and paste the URL into the Webhook URL field. 4. Save the changes in the 360dialog Hub to activate the webhook. 5. Important: Note that rotating the API key in 360dialog can clear the webhook URL. If the 
key is ever changed, this URL will need to be re-entered. 
4.3 Recommended Scenario Architecture and Best Practices 
Building robust and scalable automation requires adherence to architectural best practices. Incorporate the following principles into all Make.com scenarios: 
Error Handling: Enable the built-in "Auto-retry" feature for module errors to handle temporary service disruptions. Additionally, build dedicated error handler routes to log failures or trigger notifications for immediate attention. 
Routing: Use a Router module immediately after the webhook to direct incoming messages based on their type (e.g., text, media, button click), allowing for different processing logic for each. 
Rate Limiting: For outbound campaigns, use Sleep or queueing tools to manage the send rate. This prevents API throttling from the provider and ensures reliable delivery during high-volume bursts. 
State Management: Utilize a Data Store or an external Google Sheet to track the state of contacts, such as their opt-in status or the timestamp of their last interaction. 
Secure Secrets: Store all sensitive API keys, tokens, and credentials exclusively within Make.com's secure Connections vault. Never hard-code them directly into module fields. 
Logging: Implement a logging mechanism for inbound and outbound message payloads to a separate system for debugging. Ensure that Personally Identifiable Information (PII) is masked or excluded from these logs unless strictly necessary for operations. 
Architect's Note: Make.com Observability 
For production systems, build robust observability patterns. Configure scenario error hooks to send real-time failure alerts to a Slack channel or email. Maintain versioned backups of scenario blueprints. Schedule a simple "health check" scenario to run periodically, ensuring all critical connections and services are responsive. 
4.4 End-to-End System Test 
The final validation step is a complete end-to-end test. Send a test message from a personal phone number to the client's new WhatsApp business number. Confirm that the Make.com scenario triggers successfully and that the incoming message data is correctly processed and logged by the webhook. 
With the technical pipeline now fully connected and tested, the final step is to configure the specific, pre-approved messages that can be sent to customers. 
-------------------------------------------------------------------------------- 
5.0 WhatsApp Template Message Management 
A critical rule of the WhatsApp platform is the "24-hour window." Businesses can reply with free-form messages only within 24 hours of a user's last message. To initiate a conversation with a user or to reply after this 24-hour window has closed, businesses must use a pre-approved message template. 
5.1 Template Creation and Submission 
Message templates must be submitted to Meta for approval before they can be used. This is done through the 360dialog Hub. 
1. In the 360dialog Hub (hub.360dialog.io), navigate to Templates > Create Template. 
2. Complete the template submission form with the following details: 
Name: Must be in lowercase with underscores instead of spaces (e.g., 
promo_july). 
Category: Select the appropriate category: Marketing, Utility, or Authentication. 
Language: Specify the correct language and locale code (e.g., en_US for 
American English, he for Hebrew). 
Components: Compose the main Body of the message. Optionally, add a 
Header (text, image, video, document), a Footer, or interactive Buttons. 3. Use numbered placeholders (e.g., {{1}}, {{2}}) for any dynamic content, such as a 
customer's name or an order number. 4. Provide clear sample values for each variable to help reviewers understand the context. 5. Click Submit to send the template for review. Monitor its status until it becomes "Active." 
5.2 Sending Templates via Make.com 
Once a template is approved and "Active," it can be used in a Make.com scenario. 
1. Add the 360dialog > Send a Template Message module to a scenario. 2. Select the established 360dialog connection created in the previous step. 3. Choose the exact Name and Language code of the approved template from the 
dropdown lists. 4. Map the dynamic data from previous modules in the scenario (e.g., a contact's name 
from a Data Store) to the corresponding template placeholders. 
5.3 Quality Monitoring 
The specialist must check the Quality column in the 360dialog Hub weekly. This rating, provided by Meta, reflects user feedback. A decline in quality can lead to the template being disabled, so proactive monitoring is essential to prevent service disruption. 
Mastering template management is key to proactive and compliant communication, which leads into the final topic of overall system governance. 
-------------------------------------------------------------------------------- 
6.0 Security, Governance, and Client Handover 
A successful technical setup is only half the battle. This final section outlines the operational best practices required to maintain a secure, compliant, and well-documented system. Critically, it also ensures that the client retains ultimate ownership and control over all their digital assets. 
6.1 Credential and Key Security 
The confidentiality of sensitive credentials is to be treated as a non-negotiable security requirement. 
Password Manager: All sensitive credentials, including administrator logins, API keys, and unique webhook URLs, must be stored in a shared, secure password manager like 1Password or LastPass. 
No Plaintext Sharing: Explicitly forbid the sharing of any secrets or credentials via insecure channels such as email, Slack, or other plaintext chat applications. 
Multi-Factor Authentication (MFA): Mandate that 2-Step Verification be enforced for all administrator and developer accounts across every platform used in this infrastructure: Google Workspace, Meta, 360dialog, and Make.com. 
6.2 Asset Ownership Protocol 
The client must always be the primary owner of their accounts and assets. The developer's access should be granted as a delegated role. This principle ensures a clean and professional handover upon project completion. 
Asset Platform Required Client Ownership Status 
Developer Access Level 
Domain Registrar Account registered in the client's name. 
Delegated access as needed. 
Meta Business Manager 
Client is the primary business admin. 
Developer granted Admin role. 
360dialog Client is responsible for billing. 
Administrative rights transferred to client upon completion. 
Make.com Client is the account Owner. Developers assigned appropriate roles with least-privilege. 
6.3 Documentation and Compliance 
Thorough documentation and adherence to compliance standards are non-negotiable for enterprise-grade deployments and long-term system health. 
System Record: Create a central document that records all critical settings, including DNS configurations, masked API keys, webhook URLs, and a comprehensive list of all approved WhatsApp template names and their functions. 
Compliance & Data Governance: 
Confirm the client has a public privacy policy linked in their WhatsApp Business 
profile. 
Verify that all automated communications are sent only to contacts who have 
provided explicit and documented opt-in consent. 
Ensure Data Processing Addendums (DPAs) are in place with all relevant 
vendors (Google, Meta, 360dialog, Make.com). 
Document the protocol for honoring user data deletion requests. 
Define and document data retention limits for logs and message content to 
adhere to the principle of data minimization. 
Access Control: 
Establish a protocol for conducting quarterly access reviews across all platforms to ensure the principle of least privilege is maintained. 
Maintain a change log for critical system modifications. 
Backups: Confirm that a backup solution for Google Workspace, such as Google Vault 
or a third-party service, is enabled and configured correctly. 
With these governance principles in place, the system is ready for a final verification before going live. 
-------------------------------------------------------------------------------- 
7.0 Final Verification Checklist 
This checklist serves as the final sign-off gate before the project can be considered complete and ready for handover. The implementation specialist must confirm that every item on this list has been successfully completed and verified. 
[ ] Email send/receive is functional; SPF/DKIM/DMARC checks pass on test messages. 
[ ] Meta Business Manager shows Domain: Verified and Business: Verified.
[ ] WhatsApp number status is Connected in Meta and the 360dialog dashboard is healthy. 
[ ] A Make.com scenario successfully receives inbound webhooks from WhatsApp. 
[ ] A Make.com scenario successfully sends an approved WhatsApp template message. 
[ ] All credentials and API keys are stored securely in a password manager. 
[ ] The client is the designated owner of all primary accounts. 
 