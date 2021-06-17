import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./ReportExtension.scss";

import { Button } from "azure-devops-ui/Button";
import { Observable, ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { TextField } from "azure-devops-ui/TextField";

import { IListBoxItem } from "azure-devops-ui/ListBox";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, QueryHierarchyItem, QueryResultType, WorkItem, WorkItemQueryResult, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { showRootComponent } from "../../Common";

class ReportExtension extends React.Component<{}, {}> {
    private parameterStartDate = new ObservableValue("4/15/2021");
    private parameterVelocity = new ObservableValue("1");
    private parameterTaskAddedRatio = new ObservableValue("1");
    private parameterTeamSize = new ObservableValue("1");
    private queryItemTypeValue = new ObservableValue("");
    private selectionQueryItem = new DropdownSelection();
    private queries = new Array<QueryHierarchyItem>();
    private headers = new Array<string>();
    private workItems = new Array<Promise<WorkItem>>();
    private queryName = new ObservableArray<IListBoxItem<string>>();

    constructor(props: {}) {
        super(props);
    }

    public componentDidMount() {
        SDK.init();
        this.loadQueries();
    }

    public render() {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Report Extension" />
                <div className="page-content">
                    <div className="parameters flex-center">
                        <div className="form-section flex-row flex-center">
                            <TextField className="parameter" label="Starting Date:" value={this.parameterStartDate} onChange={(ev, newValue) => { this.parameterStartDate.value = newValue; }} />
                            <TextField className="parameter" label="Task Added Ratio:" value={this.parameterTaskAddedRatio} onChange={(ev, newValue) => { this.parameterTaskAddedRatio.value = newValue; }} />
                            <TextField className="parameter" label="Velocity:" value={this.parameterVelocity} onChange={(ev, newValue) => { this.parameterVelocity.value = newValue; }} />
                            <TextField className="parameter" label="Team Size:" value={this.parameterTeamSize} onChange={(ev, newValue) => { this.parameterTeamSize.value = newValue; }} />

                            <div className="select-query flex-center">
                                <label htmlFor="query-item-type-picker">Select Query:</label>
                                <Dropdown
                                    className="query-item-type-picker"
                                    items={this.queryName}
                                    onSelect={(event, item) => { this.queryItemTypeValue.value = item.id }}
                                    selection={this.selectionQueryItem}
                                />
                            </div>
                            <Button className="query-item-button" text="Submit" onClick={() => this.onSubmitOpenQuery()} />
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
            const queriesResult = await client.getQueries(project.id, 3, 2, false); // Depth can only be 0-2
            for (const result0 in queriesResult) {
                const l0 = queriesResult[result0]; // l1 are always folders My Queries/SharedQueries
                if (l0.isFolder) { // My Queries and Shared Queries **Folders**                     
                    const l1 = l0.children; // children of My Queries & Shared Queries
                    for (const result1 in l1) {
                        const l2 = l1[result1];
                        if (l2.isFolder) {
                            const l3 = l2.children;
                            for (const result2 in l3) {
                                const l4 = l3[result2];
                                if (!l4.isFolder) {
                                    queryNames.push(l4.name);
                                    this.queries.push(l4);
                                }
                            }
                        } else {
                            queryNames.push(l2.name);
                            this.queries.push(l2);
                        }
                    }
                } else {

                }
            }
            this.queryName.push(...queryNames.map(t => { return { id: t, data: t, text: t, name: t } }));
        }
    }

    private async onSubmitOpenQuery() {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        const client = getClient(WorkItemTrackingRestClient);
        const queryName = this.queryItemTypeValue.value;

        for (const query in this.queries) {
            const qResult = this.queries[query];
            if (qResult.name.toString() == queryName) {
                let resultQuery = await client.queryById(qResult.id, project?.id);
                let workItems = resultQuery.workItems;
                for (let i = 0; i < workItems.length; i++) {
                    let workItem = client.getWorkItem(workItems[i].id);
                    this.workItems.push(workItem);
                    console.log(await (await workItem).id)
                    console.log((await workItem).fields)

                }
                this.headers = Object.keys(resultQuery.columns)
            }
        }
    };
}


showRootComponent(<ReportExtension />);