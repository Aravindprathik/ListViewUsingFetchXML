import {
  CollectionPreferencesProps,
  Pagination,
  PropertyFilter,
  PropertyFilterProps,
  Table,
  TableProps,
} from "@cloudscape-design/components";
import {
  BLANK_SEARCH_AND,
  DEFAULT_PAGE_SIZE_IS_100,
  extractFieldNamesForDefaultVisibleContent,
  generateColumnDefinitions,
  generateFilteringProperties,
  generateVisibleContentOptions,
} from "./CloudscapeTableConfig";
import { DynamicColumnDetails } from "./CloudscapeInterface";
import {
  Preferences,
  TableEmptyState,
  TableNoMatchState,
  getMatchesCountText,
  paginationAriaLabels,
  propertyFilterI18nStrings,
} from "../GenericComponents/Utils";
import { useCollection } from "@cloudscape-design/collection-hooks";
import * as React from "react";
import { useEffect } from "react";

interface CloudscapeTableProps {
  kpiEntityId: string;
  kpiEntityName: string;
}
const CloudscapeTable: React.FC<CloudscapeTableProps> = ({
  kpiEntityId,
  kpiEntityName,
}) => {
  const [allColumns, setAllColumns] = React.useState<
    DynamicColumnDetails | undefined
  >();
  const [allItems, setAllItems] = React.useState<any | undefined>();

  const [tableDefaultPreferences, setTableDefaultPreferences] =
    React.useState<CollectionPreferencesProps.Preferences>({});

  const [tableColumnDefinitions, setTableColumnDefinitions] = React.useState<
    TableProps.ColumnDefinition<any>[]
  >([]);
  const [tableRowData, setTableRowData] = React.useState<any[]>([]);

  const [filteringProperties, setFilteringProperties] = React.useState<
    PropertyFilterProps.FilteringProperty[]
  >([]);
  const [query, setQuery] = React.useState(BLANK_SEARCH_AND);

  // generating Table default preferences from allColumns
  useEffect(() => {
    if (allColumns) {
      const defaultPreferences = {
        pageSize: DEFAULT_PAGE_SIZE_IS_100,
        visibleContent: extractFieldNamesForDefaultVisibleContent(allColumns),
        wrapLines: true,
        stripedRows: false,
        custom: false,
      } as CollectionPreferencesProps.Preferences;
      setTableDefaultPreferences(defaultPreferences);
    }
  }, [allColumns]);

  // generating Table column definitions from allColumns
  useEffect(() => {
    if (allColumns) {
      const columnDefinitions = generateColumnDefinitions(allColumns);
      console.log("columnDefinitions ", columnDefinitions);
      setTableColumnDefinitions(columnDefinitions);
    }
  }, [allColumns]);

  // generating filtering properties from allColumns
  useEffect(() => {
    if (allColumns) {
      const properties = generateFilteringProperties(allColumns);
      setFilteringProperties(properties);
    }
  }, [allColumns]);

  // generating Table row data from allItems
  useEffect(() => {
    setTableRowData(allItems || []);
  }, [allItems]);

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    propertyFilterProps,
  } = useCollection(tableRowData, {
    propertyFiltering: {
      filteringProperties,
      empty: <TableEmptyState resourceName="No data" />,
      noMatch: (
        <TableNoMatchState
          onClearFilter={() => {
            actions.setPropertyFiltering({ tokens: [], operation: "and" });
          }}
        />
      ),
    },
    pagination: {
      pageSize: tableDefaultPreferences.pageSize,
    },
    sorting: {
      defaultState: {
        sortingColumn: {
          sortingField: allColumns?.columnInfo?.sortingColumn || '',
        },
        isDescending: !allColumns?.columnInfo?.isAscending,
      },
    },
  });

  useEffect(() => {
    actions.setPropertyFiltering(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <Table
        variant="embedded"
        stickyHeader={true}
        loading={false}
        loadingText={"Loading Results..."}
        items={items}
        columnDefinitions={tableColumnDefinitions}
        visibleColumns={tableDefaultPreferences.visibleContent}
        resizableColumns={tableDefaultPreferences.custom}
        wrapLines={tableDefaultPreferences.wrapLines}
        stripedRows={tableDefaultPreferences.stripedRows}
        contentDensity={tableDefaultPreferences.contentDensity}
        filter={
          <PropertyFilter
            i18nStrings={propertyFilterI18nStrings("Table")}
            countText={getMatchesCountText(filteredItemsCount!)}
            expandToViewport={true}
            {...propertyFilterProps}
            query={query}
            onChange={(event: any) => {
              setQuery(
                event.detail.tokens?.length === 0
                  ? BLANK_SEARCH_AND
                  : event.detail
              );
            }}
          />
        }
        {...collectionProps}
        pagination={
          <Pagination
            {...paginationProps}
            ariaLabels={paginationAriaLabels(paginationProps.pagesCount)}
          />
        }
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

export default CloudscapeTable;
