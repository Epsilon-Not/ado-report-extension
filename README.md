# Azure DevOps Extension for Estimated Completion Date Report
Extension to allow custom reporting of an estimated completion date, for work items of a given query.

Original template from:
https://github.com/microsoft/azure-devops-extension-sample


## Instructions
You need a Publisher account to publish extensions to ADO (even private ones).

Instructions at: https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops
*Ignore packaging instructions as that is the older way. 

Once you have a publisher account just run: "npm run build" to create the VSIX file.
Go to: https://marketplace.visualstudio.com/manage 
Add a new extension where the .vsix file can be uploaded. 
Share the extension with your organization(click three dots to right of extension) and install.

