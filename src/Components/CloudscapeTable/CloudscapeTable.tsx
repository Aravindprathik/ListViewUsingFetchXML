import {
  Box,
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
import { IInputs } from "../../generated/ManifestTypes";

interface CloudscapeTableProps {
  kpiEntityId: string;
  kpiEntityName: string;
  pcfContext: ComponentFramework.Context<IInputs>;
}
const CloudscapeTable: React.FC<CloudscapeTableProps> = ({
  kpiEntityId,
  kpiEntityName,
  pcfContext,
}) => {
  const [dataLoading, setDataLoading] = React.useState(false);
  const [dataLoadingStatus, setDataLoadingStatus] = React.useState<
    "loading" | "error" | "success"
  >("loading");

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

  useEffect(() => {
    dynamicsHandler();
  }, [pcfContext]);

  const dynamicsHandler = async () => {
    setDataLoading(true);

    if (kpiEntityId) {
      pcfContext.webAPI
        .retrieveMultipleRecords(
          kpiEntityName,
          "?fetchXml=" + encodeURIComponent(KPI_FETCH_XML)
        )
        .then((results: any) => {
          if (results && results.entities && results.entities.length > 0) {
            console.log("AS IS results ", JSON.stringify(results));

            const kpiResult = results?.entities?.value[0];
            console.log("kpiResult ", JSON.stringify(kpiResult));
            const cb_fetchxml = kpiResult.cb_fetchxml;
            const cb_columnlayout = kpiResult.cb_columnlayout;
            console.log("cb_columnlayout ", JSON.stringify(cb_columnlayout));

            setAllColumns(cb_columnlayout);

            const primaryEntityName = getPrimaryEntityNameFromFetchXml(cb_fetchxml);

            pcfContext.webAPI
            .retrieveMultipleRecords(
              primaryEntityName,
              "?fetchXml=" + encodeURIComponent(cb_fetchxml)
            ).then((secondResult: any) => {

              secondResult

            }).catch((secondError: any) => {
              console.error("Second API call error ", secondError);
              setDataLoadingStatus("error");
            })

          }
        })
        .catch((error: any) => {
          console.error("Unable to fetch KPI Master ", error);
          setDataLoadingStatus("error");
        });

      setDataLoadingStatus("success");
    } else {
      setDataLoading(false);
      setDataLoadingStatus("error");
    }
  };

  const getPrimaryEntityNameFromFetchXml = (fetchXml: string): string => {
    let primaryEntityName: string = "";
    // @ts-ignore
    let filter = fetchXml.matchAll(/<entity name='(.*?)'>/g).next();
    if (filter && filter.value && filter.value[1]) {
      primaryEntityName = filter.value[1];
    }
    return primaryEntityName;
  };

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
          sortingField: allColumns?.columnInfo?.sortingColumn || "",
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
      {dataLoadingStatus === "error" && (
        <Box textAlign="center">
          <span>{"Error fetching records"}</span>
        </Box>
      )}
      {dataLoadingStatus !== "error" && (
        <Table
          variant="embedded"
          stickyHeader={true}
          loading={dataLoading}
          loadingText={"Loading Data..."}
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
      )}
    </>
  );
};

export default CloudscapeTable;
