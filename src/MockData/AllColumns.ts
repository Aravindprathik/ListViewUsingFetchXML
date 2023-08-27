import { DynamicColumnDetails } from "../Components/CloudscapeTable/CloudscapeInterface";

export const DynamicColumns1: DynamicColumnDetails = {
  "columnInfo": {
    "sortingColumn": "column1",
    "isAscending": true
  },
  "data": [
    {
      "fieldName": "column1",
      "displayName": "Column 1",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    },
    {
      "fieldName": "column2",
      "displayName": "Column 2",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    }
  ]
}

export const DynamicColumns: DynamicColumnDetails = {
  "columnInfo": {
    "sortingColumn": "fullname",
    "isAscending": true
  },
  "data": [
    {
      "fieldName": "fullname",
      "displayName": "Name",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "link"
      }
    },
    {
      "fieldName": "companyname",
      "displayName": "Company Name",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    },
    {
      "fieldName": "cb_athenabusinesslegalname",
      "displayName": "Legal Name",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    },
    {
      "fieldName": "address1_composite",
      "displayName": "Address",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    },
    {
      "fieldName": "createdon",
      "displayName": "Created On",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "date",
        "dateFormat": "yyyy-MM-dd"
      }
    },
    {
      "fieldName": "modifiedon",
      "displayName": "Modified On",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "dateTime",
        "dateFormat": "yyyy-MM-dd hh:mm a"
      }
    },
    {
      "fieldName": "cb_lastactivitydate",
      "displayName": "Last Activity Date",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "date",
        "dateFormat": "yyyy-MM-dd"
      }
    },
    {
      "fieldName": "cb_programleadsource",
      "displayName": "Program Lead Source",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    },
    {
      "fieldName": "statuscode",
      "displayName": "Lead Status",
      "minWidth": 80,
      "maxWidth": 100,
      "metadata": {
        "type": "string"
      }
    }
  ]
}