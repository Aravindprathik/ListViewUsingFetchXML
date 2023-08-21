import * as React from "react";
import {
  Box,
  CollectionPreferencesProps,
  PropertyFilterProps,
  StatusIndicator,
  TableProps,
} from "@cloudscape-design/components";

export interface FetchXMLRowStructure {
  fullname: string;
  companyname: string;
  cb_athenabusinesslegalname: string;
  address1_composite: string;
  createdon: string;
  modifiedon: string;
  cb_lastactivitydate: string;
  cb_programleadsource: string;
  statuscode: string;
}

export const DEFAULT_VISIBLE_CONTENT = [
  "fullname",
  "companyname",
  "cb_athenabusinesslegalname",
  "address1_composite",
  "createdon",
  "modifiedon",
  "cb_lastactivitydate",
  "cb_programleadsource",
  "statuscode",
];

export const DEFAULT_ANNOUNCEMENT_VISIBLE_CONTENT_OPTIONS: CollectionPreferencesProps.VisibleContentOptionsGroup[] =
  [
    {
      label: "Properties",
      options: [
        { id: "fullname", label: "Name", editable: false },
        { id: "companyname", label: "Company Name", editable: false },
        {
          id: "cb_athenabusinesslegalname",
          label: "Legal Name",
          editable: false,
        },
        { id: "address1_composite", label: "Address", editable: false },
        { id: "createdon", label: "Created On", editable: false },
        { id: "modifiedon", label: "Modified On", editable: true },
        {
          id: "cb_lastactivitydate",
          label: "Last Activity Date",
          editable: true,
        },
        {
          id: "cb_programleadsource",
          label: "Program Lead Source",
          editable: true,
        },
        {
          id: "statuscode",
          label: "Lead Status",
          editable: true,
        },
      ],
    },
  ];

export const ANNOUNCEMENTS_FILTERING_PROPERTIES: PropertyFilterProps.FilteringProperty[] =
  [
    {
      key: "fullname", // should match with id
      propertyLabel: "Full Name", // should match with label
      groupValuesLabel: "Full Name values", // any thing
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "companyname",
      propertyLabel: "Company Name",
      groupValuesLabel: "Company Name values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "cb_athenabusinesslegalname",
      propertyLabel: "Legal Name",
      groupValuesLabel: "Legal Name values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "address1_composite",
      propertyLabel: "Address",
      groupValuesLabel: "Address values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "createdon",
      propertyLabel: "Created On",
      groupValuesLabel: "Created On values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "modifiedon",
      propertyLabel: "Modified On",
      groupValuesLabel: "Modified On values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "cb_lastactivitydate",
      propertyLabel: "Last Activity Date",
      groupValuesLabel: "Last Activity Date values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "cb_programleadsource",
      propertyLabel: "Program Lead Source",
      groupValuesLabel: "Program Lead Source values",
      operators: [":", "!:", "=", "!="],
    },
    {
      key: "statuscode",
      propertyLabel: "Lead Status",
      groupValuesLabel: "Lead Status values",
      operators: [":", "!:", "=", "!="],
    },
  ];

export const DEFAULT_PAGE_SIZE = 100;

export const ANNOUNCEMENTS_DEFAULT_PREFERENCES: CollectionPreferencesProps.Preferences =
  {
    pageSize: DEFAULT_PAGE_SIZE,
    visibleContent: DEFAULT_VISIBLE_CONTENT,
    wrapLines: true,
    stripedRows: false,
    custom: false,
  };

export const ANNOUNCEMENT_COLUMN_DEFINITIONS: TableProps.ColumnDefinition<FetchXMLRowStructure>[] =
  [
    {
      id: "fullname",
      header: "Name",
      width: 160,
      cell: (item) => item.fullname,
      sortingField: "fullname",
    },
    {
      id: "companyname",
      header: "Company Name",
      width: 120,
      cell: (item) => item.companyname,
      sortingField: "companyname",
    },
    {
      id: "cb_athenabusinesslegalname",
      header: "Legal Name",
      cell: (item) => item.cb_athenabusinesslegalname,
      sortingField: "cb_athenabusinesslegalname",
    },
    {
      id: "address1_composite",
      header: "Address",
      cell: (item) => item.address1_composite,
      sortingField: "address1_composite",
    },
    {
      id: "createdon",
      header: "Created On",
      cell: (item) => item.createdon,
      sortingField: "createdon",
    },
    {
      id: "modifiedon",
      header: "Modified On",
      cell: (item) => item.modifiedon,
      sortingField: "modifiedon",
    },
    {
      id: "cb_lastactivitydate",
      header: "Last Activity Date",
      cell: (item) => item.cb_lastactivitydate,
      sortingField: "cb_lastactivitydate",
    },
    {
      id: "cb_programleadsource",
      header: "Program Lead Source",
      cell: (item) => item.cb_programleadsource,
      sortingField: "cb_programleadsource",
    },
    {
      id: "statuscode",
      header: "Lead Status",
      cell: (item) => item.statuscode,
      sortingField: "statuscode",
    },
  ];
