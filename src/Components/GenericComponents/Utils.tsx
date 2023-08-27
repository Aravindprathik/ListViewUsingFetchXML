import * as React from "react";
import { Box, Button, Checkbox, CollectionPreferences, PropertyFilterProps, SpaceBetween } from "@cloudscape-design/components";

export const TableNoMatchState = ({ onClearFilter }: { onClearFilter: () => void }) => (
  <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>No matches</b>
        <Box variant="p" color="inherit">
          {"We cant find a match."}
        </Box>
      </div>
      <Button onClick={onClearFilter}>Clear filter</Button>
    </SpaceBetween>
  </Box>
);

export const TableEmptyState = ({ resourceName }: { resourceName: string }) => (
  <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>No {resourceName.toLowerCase()}s</b>
        <Box variant="p" color="inherit">
          No {resourceName.toLowerCase()}s associated with this resource.
        </Box>
      </div>
      <Button>Create {resourceName.toLowerCase()}</Button>
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

  filteringPlaceholder: `Filter ${resource} by text, property or value`,
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
