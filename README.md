# Azure DevOps Custom Reporting Extension
Extension allows custom reporting, based of our own internal algorith. Calculates an estimated completion date for work items from a given query.

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



