import { useCollection } from "@cloudscape-design/collection-hooks";
import {
  Calendar,
  CollectionPreferencesProps,
  DateInput,
  FormField,
  Header,
  Pagination,
  PropertyFilter,
  PropertyFilterProps,
  Table,
  TableProps,
} from "@cloudscape-design/components";
import * as React from "react";
import {
  Preferences,
  TableEmptyState,
  TableNoMatchState,
  getMatchesCountText,
  paginationAriaLabels,
  propertyFilterI18nStrings,
} from "../GenericComponents/Utils";
import { ColumnDataType, DataEntity, DynamicColumnDetails } from "./CloudscapeInterface";
import {
  BLANK_SEARCH_AND,
  extractFieldNamesForDefaultVisibleContent,
  generateColumnDefinitions,
  generateVisibleContentOptions,
  modifyRowData,
} from "./CloudscapeTableConfig";
import moment from "moment-timezone";
import { IInputs } from "../../generated/ManifestTypes";

export interface CloudscapeGenericTableProps {
  primaryEntity: string;
  pcfContext: ComponentFramework.Context<IInputs> | null;
  allColumns: DynamicColumnDetails;
  allItems: any[];
  itemsPerPage: number;
}
export const CloudscapeGenericTable: React.FC<CloudscapeGenericTableProps> = ({ primaryEntity, pcfContext, allColumns, allItems, itemsPerPage }) => {
  const [tableRowData, setTableRowData] = React.useState<any[]>([]);
  const [tableColumnDefinitions, setTableColumnDefinitions] = React.useState<TableProps.ColumnDefinition<any>[]>([]);

  const [tableDefaultPreferences, setTableDefaultPreferences] = React.useState<CollectionPreferencesProps.Preferences>({});

  const [filteringProperties, setFilteringProperties] = React.useState<PropertyFilterProps.FilteringProperty[]>([]);
  const [query, setQuery] = React.useState(BLANK_SEARCH_AND);

  React.useEffect(() => {
    console.log("Cloudscape Table");
  }, []);

  React.useEffect(() => {
    actions.setPropertyFiltering(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // generating Table column definitions from allColumns
  React.useEffect(() => {
    if (allColumns) {
      const columnDefinitions = generateColumnDefinitions(allColumns, pcfContext, primaryEntity);
      console.log("Table Col Definitions ", JSON.stringify(columnDefinitions));
      setTableColumnDefinitions(columnDefinitions);

      const parsedData = modifyRowData(allItems, allColumns);
      console.log("Table Row Definitions ", JSON.stringify(parsedData));
      setTableRowData(parsedData || []);
    }
  }, [pcfContext, primaryEntity, allColumns, allItems]);

  // generating Table default preferences from allColumns
  React.useEffect(() => {
    if (allColumns) {
      const defaultPreferences = {
        pageSize: itemsPerPage,
        visibleContent: extractFieldNamesForDefaultVisibleContent(allColumns),
        wrapLines: true,
        stripedRows: false,
        custom: false,
      } as CollectionPreferencesProps.Preferences;
      setTableDefaultPreferences(defaultPreferences);
    }
  }, [allColumns, itemsPerPage]);
  // generating filtering properties from allColumns
  React.useEffect(() => {
    if (allColumns) {
      const properties = generateFilteringProperties(allColumns);
      setFilteringProperties(properties);
    }
  }, [allColumns]);
  const { items, actions, filteredItemsCount, collectionProps, paginationProps, propertyFilterProps } = useCollection(tableRowData, {
    propertyFiltering: {
      filteringProperties,
      empty: <TableEmptyState />,
      noMatch: <TableNoMatchState />,
    },
    pagination: {
      pageSize: tableDefaultPreferences.pageSize,
    },
    sorting: {
      defaultState: {
        sortingColumn: {
          sortingField: allColumns?.columnInfo?.sortingColumn,
          sortingComparator: (a: any, b: any) => {
            if (allColumns?.columnInfo?.sortingColumnDataType === "date" || allColumns?.columnInfo?.sortingColumnDataType === "dateTime") {
              return moment(a[allColumns?.columnInfo?.sortingColumn]).isBefore(b[allColumns?.columnInfo?.sortingColumn]) ? -1 : 1;
            } else {
              return a[allColumns?.columnInfo?.sortingColumn].localeCompare(b[allColumns?.columnInfo?.sortingColumn]);
            }
          },
        },
        isDescending: !allColumns?.columnInfo?.isAscending,
      },
    },
  });

  return (
    <>
      <Table
        variant="embedded"
        stickyHeader={true}
        loading={false}
        loadingText={"Loading Data..."}
        items={items}
        columnDefinitions={tableColumnDefinitions}
        visibleColumns={tableDefaultPreferences.visibleContent}
        resizableColumns={tableDefaultPreferences.custom}
        wrapLines={tableDefaultPreferences.wrapLines}
        stripedRows={tableDefaultPreferences.stripedRows}
        contentDensity={tableDefaultPreferences.contentDensity}
        header={<Header counter={`(${tableRowData?.length})`}>{allColumns?.columnInfo.tableName || ""}</Header>}
        filter={
          <PropertyFilter
            i18nStrings={propertyFilterI18nStrings("Table")}
            countText={getMatchesCountText(filteredItemsCount!)}
            expandToViewport={true}
            {...propertyFilterProps}
            query={query}
            onChange={(event: any) => {
              setQuery(event.detail.tokens?.length === 0 ? BLANK_SEARCH_AND : event.detail);
            }}
          />
        }
        {...collectionProps}
        pagination={<Pagination {...paginationProps} ariaLabels={paginationAriaLabels(paginationProps.pagesCount)} />}
        preferences={
          <Preferences
            preferences={tableDefaultPreferences}
            setPreferences={setTableDefaultPreferences}
            visibleContentOptions={generateVisibleContentOptions(allColumns)}
          />
        }
      />
    </>
  );
};

export function generateFilteringProperties(dynamicColumnDetails: DynamicColumnDetails): any[] {
  const filteringProperties: any[] = dynamicColumnDetails.data
    .filter((items: DataEntity) => items.isFilterable)
    .map((dataEntity: DataEntity) => {
      const dataType: ColumnDataType = dataEntity.metadata.type;
      let operators: any[] = [];

      if (dataType === "string") {
        operators = [":", "!:", "=", "!="];
      } else if (dataType === "number") {
        operators = ["=", "!=", "<", "<=", ">", ">="];
      } else if (dataType === "date") {
        operators = [":", "!:", "=", "!="];
      } else if (dataType === "dateTime") {
        operators = [":", "!:", "=", "!="];
      } else {
        operators = [":", "!:", "=", "!="];
      }

      return {
        key: dataEntity.fieldName,
        propertyLabel: dataEntity.displayName,
        groupValuesLabel: `${dataEntity.displayName} values`,
        operators,
      } as any;
    });

  return filteringProperties;
}
