import { IInputs, IOutputs } from "./generated/ManifestTypes";
import "@cloudscape-design/global-styles/index.css";
import * as React from "react";
import { KPIDataLoader, KPIDataLoaderProps } from "./Components/CloudscapeTable/KPIDataLoader";

export class FetchXmlDetailsList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    private _primaryEntityName: string;
    private _fetchXML: string | null;
    private _columnLayout: Array<any>;
    private _isDebugMode: boolean;
    private _baseEnvironmentUrl?: string;
    private _itemsPerPage: number | null;
    private _kpiEntityId : string;
    private _kpiEntityName : string;
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
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.initVars(context, notifyOutputChanged, container);
    }

    private initVars(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this._isDebugMode = false;
        this._itemsPerPage = 20;

       /* if (this._context.parameters.DebugMode) {
            this._isDebugMode = this._context.parameters.DebugMode.raw == "1";
        }*/

        // If you want this to break every time you set isDebugMode to true
        //if (this._isDebugMode) { 
        //    debugger;  // eslint-disable-line no-debugger        
        //}

       /*  if (this._context.parameters.ItemsPerPage) {
            this._itemsPerPage = this._context.parameters.ItemsPerPage.raw;
        }*/

        // TODO: Validate the input parameters to make sure we get a friendly error instead of weird errors
       /*  var fetchXML: string | null = this._context.parameters.FetchXml.raw;
        var recordIdPlaceholder: string | null = this._context.parameters.RecordIdPlaceholder.raw; // ?? "";  */

        // This is just the simple control where the subgrid will be placed on the form
        var controlAnchorField: string | null = this._context.parameters.ControlAnchorField.raw;
        // const recordIdLookupValue: ComponentFramework.EntityReference = this._context.parameters.RecordId.raw[0];

        // Other values if we need them
        this._kpiEntityId = this._context.parameters.KPILookup.raw[0].id;
        console.log("KPIidInitView : ",this._kpiEntityId);
        this._kpiEntityName = this._context.parameters.KPILookup.raw[0].entityType;
        console.log("kpiEntityId : ",this._kpiEntityId, " kpiEntityName : ", this._kpiEntityName);
        let entityId = (<any>this._context.mode).contextInfo.entityId;
        let entityTypeName = (<any>this._context.mode).contextInfo.entityTypeName;
        let entityDisplayName = (<any>this._context.mode).contextInfo.entityRecordName;
        console.log("entityTypeName : ",entityTypeName, " entityDisplayName : ", entityDisplayName);
        // This breaks when you use the PCF Test Harness.  Neat!
        try {
            this._baseEnvironmentUrl = (<any>this._context)?.page?.getClientUrl();
            console.log("_baseEnvironmentUrl : ",this._baseEnvironmentUrl, " entityDisplayName : ", entityDisplayName);
        }
        catch (ex) {
            this._baseEnvironmentUrl = "https://localhost";
        }
        var recordId: string = entityId; //this._context.parameters.RecordId.raw ?? currentRecordId;


    }


    // Replace ALL occurrences of a string
    private replaceAll(source: string, find: string, replace: string): string {
        // eslint-disable-next-line no-useless-escape
        return source.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    }

    private getPrimaryEntityNameFromFetchXml(fetchXml: string): string {
        let primaryEntityName: string = "";
        // @ts-ignore
        let filter = fetchXml.matchAll(/<entity name='(.*?)'>/g).next();
        if (filter && filter.value && filter.value[1]) {
            primaryEntityName = filter.value[1];
        }
        return primaryEntityName;
    }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // debugger;  // eslint-disable-line no-debugger
        // let props = { columns: this._columnLayout, primaryEntityName: this._primaryEntityName, fetchXml: this._fetchXML, isDebugMode: this._isDebugMode, context: context, baseD365Url: this._baseEnvironmentUrl };
        let props : KPIDataLoaderProps = {
            kpiEntityId :this._kpiEntityId != null ?this._kpiEntityId.toString() :this._context.parameters.KPILookup.raw[0].id.toString(),
            kpiEntityName : this._kpiEntityName,
            pcfContext: this._context,
            itemsPerPage : this._itemsPerPage || 10
        }
        console.log("KPIidUpdateView : ",this._context.parameters.KPILookup.raw.toString());
        return React.createElement(KPIDataLoader, props);

        // TODO: Is it possible to support a grid without a columnlayout?
        // i.e. Create a default columnListLayout from the data

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
