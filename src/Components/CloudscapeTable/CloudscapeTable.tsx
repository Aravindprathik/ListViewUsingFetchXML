import {
  Box,
  CollectionPreferencesProps,
  Header,
  Pagination,
  PropertyFilter,
  PropertyFilterProps,
  Table,
  TableProps,
} from "@cloudscape-design/components";
import {
  BLANK_SEARCH_AND,
  DEFAULT_PAGE_SIZE_IS_20,
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
import * as moment from "moment-timezone";
import { DefaultDateFormat, DefaultDateTimeFormat } from "./CellComponents";

export interface CloudscapeTableProps {
  kpiEntityId: string;
  kpiEntityName: string;
  pcfContext: ComponentFramework.Context<IInputs>;
  itemsPerPage: number;
}
const CloudscapeTable: React.FC<CloudscapeTableProps> = ({
  kpiEntityId,
  kpiEntityName,
  pcfContext,
  itemsPerPage,
}) => {
  const [dataLoading, setDataLoading] = React.useState(false);
  const [dataLoadingStatus, setDataLoadingStatus] = React.useState<
    "loading" | "error" | "success"
  >("loading");

  const [primaryEntity, setPrimaryEntityName] = React.useState("");
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
        pageSize: DEFAULT_PAGE_SIZE_IS_20,
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
      const columnDefinitions = generateColumnDefinitions(
        allColumns,
        pcfContext,
        primaryEntity
      );
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

    try {
      if (kpiEntityId) {
        var fetchData = {
          cb_kpimasterdataid: kpiEntityId,
        };
        console.log(
          "fetchData.cb_kpimasterdataid",
          fetchData.cb_kpimasterdataid
        );
        var fetchXml = [
          "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>",
          "  <entity name='cb_kpimasterdata'>",
          "    <attribute name='cb_kpimasterdataid'/>",
          "    <attribute name='cb_name'/>",
          "    <attribute name='cb_fetchxml'/>",
          "    <attribute name='cb_columnlayout'/>",
          "    <order attribute='cb_name' descending='false'/>",
          "    <filter type='and'>",
          "      <condition attribute='cb_kpimasterdataid' operator='eq' value='",
          kpiEntityId /*{2ED4C990-9C42-EE11-BDF4-0022482A939E}*/,
          "'/>",
          "    </filter>",
          "  </entity>",
          "</fetch>",
        ].join("");

        pcfContext.webAPI
          .retrieveMultipleRecords(
            "cb_kpimasterdata",
            "?fetchXml=" + encodeURIComponent(fetchXml)
          )
          .then(
            (results: any) => {
              if (results && results.entities && results.entities.length > 0) {
                var firstKpiEntity = results.entities;
                console.log("firstKpiEntity ", firstKpiEntity);

                let cb_fetchxml = firstKpiEntity[0].cb_fetchxml;
                console.log("cb_fetchxml ", cb_fetchxml);

                let _columnlayout = firstKpiEntity[0].cb_columnlayout;
                console.log("cb_columnlayout ", JSON.stringify(_columnlayout));

                let _finalColumnLayout =
                  _columnlayout != null ? JSON.parse(_columnlayout) : null;

                let fetchXML_AllItems = cb_fetchxml.replace(/"/g, "'");
                console.log("fetchXML_AllItems : ", fetchXML_AllItems);

                const _primaryEntityName =
                  getPrimaryEntityNameFromFetchXml(fetchXML_AllItems);
                console.log("primaryEntityName ", _primaryEntityName);

                setPrimaryEntityName(_primaryEntityName);
                setAllColumns(_finalColumnLayout);

                pcfContext.webAPI
                  .retrieveMultipleRecords(
                    _primaryEntityName,
                    "?fetchXml=" + encodeURIComponent(fetchXML_AllItems)
                  )
                  .then(
                    (results: any) => {
                      if (
                        results &&
                        results.entities &&
                        results.entities.length > 0
                      ) {
                        const _allItems = results.entities;
                        console.log("_allItems ", _allItems);
                        setAllItems(_allItems);
                        setDataLoadingStatus("success");
                      }
                    },
                    (e: any) => {
                      console.error("An error occurred:", e);
                      setDataLoadingStatus("error");
                    }
                  );
              }
            },

            (e: any) => {
              console.error("An error occurred:", e);
              setDataLoadingStatus("error");
            }
          );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setDataLoadingStatus("error");
    } finally {
      setDataLoading(false);
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

  function modifyRowData(
    rowData: any[],
    allColumns: DynamicColumnDetails
  ): any[] {
    const modifiedData = rowData.map((row) => {
      const modifiedRow = { ...row };

      allColumns.data.forEach((dataEntity) => {
        if (dataEntity.isColumnVisible && dataEntity.fieldName in row) {
          if (dataEntity.metadata.type === "date") {
            const originalDate = row[dataEntity.fieldName];
            if (originalDate) {
              modifiedRow[dataEntity.fieldName] = moment(originalDate).format(
                dataEntity.metadata.dateFormat || DefaultDateFormat
              );
            }
          }

          if (dataEntity.metadata.type === "dateTime") {
            const originalDate = row[dataEntity.fieldName];
            if (originalDate) {
              modifiedRow[dataEntity.fieldName] = moment(originalDate).format(
                dataEntity.metadata.dateFormat || DefaultDateTimeFormat
              );
            }
          }

          if (dataEntity.metadata.type === "boolean") {
            const originalData = row[dataEntity.fieldName];
            modifiedRow[dataEntity.fieldName] = originalData ? "Yes" : "No";
          }

          // Add more conditions for other data types if needed
        }
      });

      return modifiedRow;
    });

    console.log("modifyRowData ", JSON.stringify(modifiedData));
    return modifiedData;
  }

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
      empty: <TableEmptyState resourceName="No results" />,
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
          header={
            <Header counter={`(${tableRowData?.length})`}>
              {allColumns?.columnInfo.tableName || ""}
            </Header>
          }
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
