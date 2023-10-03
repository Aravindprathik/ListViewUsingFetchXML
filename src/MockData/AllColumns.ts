import { DynamicColumnDetails } from "../Components/CloudscapeTable/CloudscapeInterface";

export const MOCK_KPI_ALL_COLUMNS: DynamicColumnDetails = {
  columnInfo: { 
    tableName: "All Open Sales Support Cases", 
    sortingColumn: "modifiedonDate", 
    sortingColumnDataType: "date",
    isAscending: true 
  },
  data: [
    {
      fieldName: "_cb_relatedtoid_value@OData.Community.Display.V1.FormattedValue",
      displayName: "Related To",
      isColumnVisible: false,
      isFilterable: true,
      minWidth: 170,
      maxWidth: 190,
      metadata: { type: "string" },
    },
    {
      fieldName: "_cb_workedbyid_value@OData.Community.Display.V1.FormattedValue",
      displayName: "Worked by",
      isColumnVisible: false,
      isFilterable: true,
      minWidth: 170,
      maxWidth: 190,
      metadata: { type: "string" },
    },
    {
      fieldName: "createdon",
      displayName: "Created On",
      isColumnVisible: false,
      isFilterable: false,
      minWidth: 170,
      maxWidth: 190,
      metadata: { type: "date", dateFormat: "MM/DD/YYYY" },
    },
    {
      fieldName: "modifiedonDate",
      displayName: "Modified Date",
      isColumnVisible: false,
      isFilterable: true,
      minWidth: 170,
      maxWidth: 190,
      metadata: { type: "date", dateFormat: "MM/DD/YYYY" },
    },
    {
      fieldName: "modifiedonDateTime",
      displayName: "Modified DateTime",
      isColumnVisible: false,
      isFilterable: true,
      minWidth: 170,
      maxWidth: 190,
      //metadata: { type: "string", dateFormat: "MM/DD/YYYY hh:mm A" },
      metadata: { type: "string" },
    },
    {
      fieldName: "_cb_casestatus_value@OData.Community.Display.V1.FormattedValue",
      displayName: "Status",
      isColumnVisible: false,
      isFilterable: true,
      minWidth: 150,
      maxWidth: 190,
      metadata: { type: "string" },
    },
  ],
};
