import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./ReportExtension.scss";

import { Button } from "azure-devops-ui/Button";
import { Observable, ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { TextField } from "azure-devops-ui/TextField";

import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { showRootComponent } from "../../Common";


class WorkItemOpenContent extends React.Component<{}, {}> {

    private parameterStartDate = new ObservableValue("4/15/2021");
    private parameterVelocity = new ObservableValue("1");
    private parameterTaskAddedRatio = new ObservableValue("1");
    private parameterTeamSize = new ObservableValue("1");
    private workItemTypeValue = new ObservableValue("Bug");
    private queryItemTypeValue = new ObservableValue("Query");
    private selectionQueryItem = new DropdownSelection();    
    private queries = new ObservableArray<IListBoxItem<string>>();

    constructor(props: {}) {
        super(props);
    }

    public componentDidMount() {
        SDK.init();
        /*this.loadWorkItemTypes();*/
        this.loadQueries();
    }


    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Report Extension" />
                <div className="page-content">
                    <div className="parameters flex-center">
                        <div className="sample-form-section flex-row flex-center">
                            <TextField className="parameter" label="Starting Date:" value={this.parameterStartDate} onChange={(ev, newValue) => { this.parameterStartDate.value = newValue; }} />
                            <TextField className="parameter" label="Task Added Ratio:" value={this.parameterTaskAddedRatio} onChange={(ev, newValue) => { this.parameterTaskAddedRatio.value = newValue; }} />
                            <TextField className="parameter" label="Velocity:" value={this.parameterVelocity} onChange={(ev, newValue) => { this.parameterVelocity.value = newValue; }} />
                            <TextField className="parameter" label="Team Size:" value={this.parameterTeamSize} onChange={(ev, newValue) => { this.parameterTeamSize.value = newValue; }} />
                            
                            <div className="select-query flex-center">
                                <label htmlFor="query-item-type-picker">Select Query:</label>
                                <Dropdown
                                    className="query-item-type-picker"
                                    items={this.queries}
                                    onSelect={(event, item) => { this.queryItemTypeValue.value = item.id }}
                                    selection={this.selectionQueryItem}
                                />
                            </div>
                            {/*Submit button currently opens work item with id of Team Size value*/}
                            <Button className="sample-work-item-button" text="Submit" onClick={() => this.onOpenExistingWorkItemClick()} />
                        </div>

                        
                    </div>
                </div>
            </Page>
        );
    }


    private async loadQueries(): Promise<void> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        let queryNames = [];

        if (!project) {
            console.log("No Project");
        }
        else {
            const client = getClient(WorkItemTrackingRestClient);
            const queriesResult = await client.getQueries(project.id, 3, 2, false);          
            for (const result0 in queriesResult) {
                const l0 = queriesResult[result0]; // l1 are always folders My Queries/SharedQueries
                if (l0.isFolder) {
                    /*queryNames.push(l0.name); // My Queries and Shared Queries **Folders** */
                    const l1 = l0.children; // children of My Queries & Shared Queries...
                    for (const result1 in l1) {
                        const l2 = l1[result1];
                        if (l2.isFolder) {
                            queryNames.push(l2.name);  
                            const l3 = l2.children;
                            for (const result2 in l3) {
                                const l4 = l3[result2]; 
                                queryNames.push(l4.name); // queries level 2
                            }
                        } else {
                            queryNames.push(l2.name); // queries level 1
                        }
                    }

                } else {
                    queryNames.push(l0.name); // queries level 0
                }
                
                
            } 
            this.queries.push(...queryNames.map(t => { return { id: t, data: t, text: t, name: t } }));
        }     
    }

    private async onOpenExistingWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(this.parameterTeamSize.value));
    };

    private async onOpenNewWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openNewWorkItem(this.workItemTypeValue.value, { 
            Title: "Opened a work item from the Work Item Nav Service",
            Tags: "extension;wit-service",
            priority: 1,
            "System.AssignedTo": SDK.getUser().name,
         });
    };
}

showRootComponent(<WorkItemOpenContent />);