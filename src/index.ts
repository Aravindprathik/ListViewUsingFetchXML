import { IInputs, IOutputs } from "./generated/ManifestTypes";
import "@cloudscape-design/global-styles/index.css";
import * as React from "react";
import { KPIDataLoader, KPIDataLoaderProps } from "./Components/CloudscapeTable/KPIDataLoader";
import { generateColumnDefinitions } from "./Components/CloudscapeTable/CloudscapeTableConfig";
import { column_Mock } from "./MockData/AllColumns";
import { CloudscapeGenericTable, CloudscapeGenericTableProps } from "./Components/CloudscapeTable/CloudscapeGenericTable";
import { RowData } from "./MockData/AllItems";
import LoadingSpinner from "./Components/GenericComponents/LoadingSpinner";

export class FetchXmlDetailsList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    private _primaryEntityName: string;
    private _fetchXML: string | null;
    private _columnLayout: Array<any>;
    private _isDebugMode: boolean;
    private _baseEnvironmentUrl?: string;
    private _itemsPerPage: number | null;
    private _kpiEntityId: string | null;
    private _kpiEntityName: string | null;
    // private _totalNumberOfRecords: number;    

    /** General */
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _container: HTMLDivElement;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public async init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ): Promise<void> {
        await this.waitForKPILookup(context);
        this.notifyOutputChanged = notifyOutputChanged;
        this.initVars(context, notifyOutputChanged, container);

    }

    private async waitForKPILookup(context: ComponentFramework.Context<IInputs>): Promise<void> {
        while (!context?.parameters?.KPILookup?.raw) {
            // Wait for a short period (e.g., 100 milliseconds) before checking again.
            await this.sleep(100);
        }
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private initVars(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this._isDebugMode = false;
        this._itemsPerPage = 20;

        // Other values if we need them
        const lookupValue: ComponentFramework.LookupValue = context.parameters.KPILookup.raw[0];
        //Xrm.Page.getAttribute

        var kpiEntityId: string | null = lookupValue.id;
        console.log("KPIidInitView : ", kpiEntityId);
        this._kpiEntityId = kpiEntityId;
        var kpiEntityName: string | null = lookupValue.entityType;
        console.log("KPIidInitView : ", kpiEntityName);
        this._kpiEntityName = kpiEntityName;

        let entityId = (<any>this._context.mode).contextInfo.entityId;
        let entityTypeName = (<any>this._context.mode).contextInfo.entityTypeName;
        let entityDisplayName = (<any>this._context.mode).contextInfo.entityRecordName;
        console.log("entityId : ", entityId, "entityTypeName : ", entityTypeName, " entityDisplayName : ", entityDisplayName);

        // This breaks when you use the PCF Test Harness.  Neat!
        try {
            this._baseEnvironmentUrl = (<any>this._context)?.page?.getClientUrl();
            console.log("_baseEnvironmentUrl : ", this._baseEnvironmentUrl, " entityDisplayName : ", entityDisplayName);
        }
        catch (ex) {
            this._baseEnvironmentUrl = "https://localhost";
        }
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(): React.ReactElement {
        if (this._kpiEntityId) {
            console.log("Inside KPI Contains Data - KPIID UpdateView",this._kpiEntityId);
            let props: KPIDataLoaderProps = {
                kpiEntityId: this._kpiEntityId,
                kpiEntityName: this._kpiEntityName,
                pcfContext: this._context,
                itemsPerPage: this._itemsPerPage || 10
            }
            console.log("KPI Lookup : ", this._context.parameters.KPILookup.raw.toString());
            return React.createElement(KPIDataLoader, props);
        }
        else {
            console.log("_kpiEntityId doesnot contains ...");
            return React.createElement(LoadingSpinner);
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}