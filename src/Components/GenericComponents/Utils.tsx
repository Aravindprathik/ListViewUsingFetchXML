import { Box, Checkbox, CollectionPreferences, PropertyFilterProps, SpaceBetween } from "@cloudscape-design/components";
import * as React from "react";
import { DynamicColumnDetails } from "../CloudscapeTable/CloudscapeInterface";
import moment from "moment-timezone";
import { DefaultDateFormat, DefaultDateTimeFormat } from "../CloudscapeTable/CellComponents";

export const modifyRowData = (rowData: any[], allColumns: DynamicColumnDetails): any[] => {
  const modifiedData = rowData.map((row) => {
    const modifiedRow = { ...row };

    allColumns.data.forEach((dataEntity) => {
      if (dataEntity.fieldName in row) {
        let originalData = row[dataEntity.fieldName];

        if (dataEntity.metadata.type === "date") {
          const modDate = moment.utc(originalData).format(dataEntity.metadata.dateFormat || DefaultDateFormat);
          
          console.log("Received original date ", originalData);
          console.log("Modified original date ", modDate);

          modifiedRow[dataEntity.fieldName] = modDate;
        }

        if (dataEntity.metadata.type === "dateTime") {
          const modDateTime = moment.utc(originalData).format(dataEntity.metadata.dateFormat || DefaultDateTimeFormat);

          console.log("Received original dateTime ", originalData);
          console.log("Modified original dateTime ", modDateTime);

          modifiedRow[dataEntity.fieldName] = modDateTime;
        }

        if (dataEntity.metadata.type === "boolean") {
          modifiedRow[dataEntity.fieldName] = originalData ? "Yes" : "No";
        }
      }
    });

    return modifiedRow;
  });

  return modifiedData;
}

export const TableNoMatchState: React.FC = () => {
  return (
    <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
      <SpaceBetween size="xxs">
        <div>
          <b>No matches</b>
          <Box variant="p" color="inherit">
            {"We cant find a match."}
          </Box>
        </div>
      </SpaceBetween>
    </Box>
  );
};

export const TableEmptyState: React.FC = () => (
  <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>{"No results"}</b>
      </div>
    </SpaceBetween>
  </Box>
);

export const BLANK_SEARCH_AND = {
  tokens: [],
  operation: "and",
} as PropertyFilterProps.Query;

export const propertyFilterI18nStrings: (resource?: any) => PropertyFilterProps.I18nStrings = (resource) => ({
  filteringAriaLabel: "your choice",
  dismissAriaLabel: "Dismiss",
  clearAriaLabel: "Clear",

  filteringPlaceholder: "Filter by keyword",
  groupValuesText: "Values",
  groupPropertiesText: "Tag",
  operatorsText: "Operators",

  operationAndText: "and",
  operationOrText: "or",

  operatorLessText: "Less than",
  operatorLessOrEqualText: "Less than or equal",
  operatorGreaterText: "Greater than",
  operatorGreaterOrEqualText: "Greater than or equal",
  operatorContainsText: "Contains",
  operatorDoesNotContainText: "Does not contain",
  operatorEqualsText: "Equals",
  operatorDoesNotEqualText: "Does not equal",

  editTokenHeader: "Edit filter",
  propertyText: "Property",
  operatorText: "Operator",
  valueText: "Value",
  cancelActionText: "Cancel",
  applyActionText: "Apply",
  allPropertiesLabel: "All properties",

  tokenLimitShowMore: "Show more",
  tokenLimitShowFewer: "Show fewer",
  clearFiltersText: "Clear filters",
  removeTokenButtonAriaLabel: (token: any) => `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
  enteredTextLabel: (text: any) => `Use: "${text}"`,
});

export function getMatchesCountText(count: number) {
  return count === 1 ? `1 match` : `${count} matches`;
}

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10 items" },
  { value: 20, label: "20 items" },
  { value: 30, label: "30 items" },
  { value: 50, label: "50 items" },
  { value: 100, label: "100 items" },
  { value: 200, label: "200 items" },
];

export const Preferences = ({ preferences, setPreferences, disabled, pageSizeOptions = PAGE_SIZE_OPTIONS, visibleContentOptions }: any) => (
  <CollectionPreferences
    title="Preferences"
    confirmLabel="Confirm"
    cancelLabel="Cancel"
    disabled={disabled}
    preferences={preferences}
    onConfirm={({ detail }) => setPreferences(detail)}
    pageSizePreference={{
      title: "Page size",
      options: pageSizeOptions,
    }}
    wrapLinesPreference={{
      label: "Wrap lines",
      description: "Check to see all the text and wrap the lines",
    }}
    stripedRowsPreference={{
      label: "Striped rows",
      description: "Check to add alternating shaded rows",
    }}
    visibleContentPreference={{
      title: "Select visible columns",
      options: visibleContentOptions,
    }}
    customPreference={(checked, setChecked) => (
      <Checkbox
        onChange={({ detail }: any) => {
          setChecked(detail.checked);
        }}
        checked={checked}
      >
        Resizable Columns
      </Checkbox>
    )}
  />
);

export const paginationAriaLabels: (totalPages?: number) => any = (totalPages) => ({
  nextPageLabel: "Next page",
  previousPageLabel: "Previous page",
  pageLabel: (pageNumber: any) => `Page ${pageNumber} of ${totalPages || "all pages"}`,
});
