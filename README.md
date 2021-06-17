# Azure DevOps Extension for Estimated Completion Date Report
Extension allows custom reporting of an estimated completion date, for work items from a given query.

Original template from:
https://github.com/microsoft/azure-devops-extension-sample

## Dependencies

- [azure-devops-extension-sdk](https://github.com/Microsoft/azure-devops-extension-sdk): Required module for Azure DevOps extensions which allows communication between the host page and the extension iframe.
- [azure-devops-extension-api](https://github.com/Microsoft/azure-devops-extension-api): Contains REST client libraries for the various Azure DevOps feature areas.
- [azure-devops-ui](https://developer.microsoft.com/azure-devops): UI library containing the React components used in the Azure DevOps web UI.

External Dependencies:

- `React` - Is used to render the UI in the samples, and is a dependency of `azure-devops-ui`.
- `TypeScript` - Written in TypeScript and complied to JavaScript
- `SASS` - Extension is styled using SASS (which is compiled to CSS and delivered in webpack js bundles).
- `webpack` - Is used to gather dependencies into a single javascript bundle.

## Instructions
You need a Publisher account to publish extensions to ADO (even private ones).

Instructions at: https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops
*Ignore packaging instructions as that is the older way. 

Once you have a publisher account just run: "npm run build" to create the VSIX file.
Go to: https://marketplace.visualstudio.com/manage 
Add a new extension where the .vsix file can be uploaded. 
Share the extension with your organization(click three dots to right of extension) and install.

