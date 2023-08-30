import { Box, CollectionPreferencesProps, Header, Pagination, PropertyFilter, PropertyFilterProps, Table, TableProps } from "@cloudscape-design/components";
import {
  BLANK_SEARCH_AND,
  DEFAULT_PAGE_SIZE_IS_20,
  extractFieldNamesForDefaultVisibleContent,
  generateColumnDefinitions,
  generateFilteringProperties,
  generateVisibleContentOptions,
} from "./CloudscapeTableConfig";
import { DynamicColumnDetails } from "./CloudscapeInterface";
import { Preferences, TableEmptyState, TableNoMatchState, getMatchesCountText, paginationAriaLabels, propertyFilterI18nStrings } from "../GenericComponents/Utils";
import { useCollection } from "@cloudscape-design/collection-hooks";
import * as React from "react";
import { useEffect } from "react";
import { IInputs } from "../../generated/ManifestTypes";
import * as moment from "moment-timezone";
import { DefaultDateFormat, DefaultDateTimeFormat } from "./CellComponents";
import LoadingSpinner from "../GenericComponents/LoadingSpinner";
import ErrorContainer from "../GenericComponents/ErrorContainer";
import { CloudscapeGenericTable } from "./CloudscapeGenericTable";

export interface CloudscapeTableProps {
  kpiEntityId: string;
  kpiEntityName: string;
  pcfContext: ComponentFramework.Context<IInputs>;
  itemsPerPage: number;
}
const CloudscapeTable: React.FC<CloudscapeTableProps> = ({ kpiEntityId, kpiEntityName, pcfContext, itemsPerPage }) => {
  const [dataLoadingStatus, setDataLoadingStatus] = React.useState<"loading" | "error" | "success">("loading");

  const [primaryEntity, setPrimaryEntityName] = React.useState("");
  const [allColumns, setAllColumns] = React.useState<DynamicColumnDetails | undefined>();
  const [allItems, setAllItems] = React.useState<any | undefined>();

  const [tableColumnDefinitions, setTableColumnDefinitions] = React.useState<TableProps.ColumnDefinition<any>[]>([]);

  // generating Table column definitions from allColumns
  useEffect(() => {
    if (allColumns) {
      const columnDefinitions = generateColumnDefinitions(allColumns, pcfContext, primaryEntity);
      console.log("columnDefinitions ", columnDefinitions);
      setTableColumnDefinitions(columnDefinitions);
    }
  }, [allColumns]);

  useEffect(() => {
    dynamicsHandler();
  }, [pcfContext]);

  const dynamicsHandler = async () => {
    setDataLoadingStatus("loading");

    try {
      if (kpiEntityId) {
        var fetchData = {
          cb_kpimasterdataid: kpiEntityId,
        };
        console.log("fetchData.cb_kpimasterdataid", fetchData.cb_kpimasterdataid);
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

        pcfContext.webAPI.retrieveMultipleRecords("cb_kpimasterdata", "?fetchXml=" + encodeURIComponent(fetchXml)).then(
          (results: any) => {
            if (results && results.entities && results.entities.length > 0) {
              var firstKpiEntity = results.entities;
              console.log("firstKpiEntity ", firstKpiEntity);

              let cb_fetchxml = firstKpiEntity[0].cb_fetchxml;
              console.log("cb_fetchxml ", cb_fetchxml);

              let _columnlayout = firstKpiEntity[0].cb_columnlayout;
              console.log("cb_columnlayout ", JSON.stringify(_columnlayout));

              let _finalColumnLayout = _columnlayout != null ? JSON.parse(_columnlayout) : null;

              let fetchXML_AllItems = cb_fetchxml.replace(/"/g, "'");
              console.log("fetchXML_AllItems : ", fetchXML_AllItems);

              const _primaryEntityName = getPrimaryEntityNameFromFetchXml(fetchXML_AllItems);
              console.log("primaryEntityName ", _primaryEntityName);

              setPrimaryEntityName(_primaryEntityName);
              setAllColumns(_finalColumnLayout);

              pcfContext.webAPI.retrieveMultipleRecords(_primaryEntityName, "?fetchXml=" + encodeURIComponent(fetchXML_AllItems)).then(
                (results: any) => {
                  if (results && results.entities && results.entities.length > 0) {
                    const rawItemData = results.entities;

                    const parsedData = modifyRowData(rawItemData, _finalColumnLayout);
                    setAllItems(parsedData);
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

  function modifyRowData(rowData: any[], allColumns: DynamicColumnDetails): any[] {
    const modifiedData = rowData.map((row) => {
      const modifiedRow = { ...row };
      const _FORMATTEDVALUE = "@OData.Community.Display.V1.FormattedValue";

      allColumns.data.forEach((dataEntity) => {
        if (dataEntity.fieldName in row) {
          let originalData = row[dataEntity.fieldName];

          if (row[dataEntity.fieldName + _FORMATTEDVALUE]) {
            originalData = row[dataEntity.fieldName + _FORMATTEDVALUE];
          }

          if (dataEntity.metadata.type === "date") {
            modifiedRow[dataEntity.fieldName] = moment(originalData).format(dataEntity.metadata.dateFormat || DefaultDateFormat);
          }

          if (dataEntity.metadata.type === "dateTime") {
            modifiedRow[dataEntity.fieldName] = moment(originalData).format(dataEntity.metadata.dateFormat || DefaultDateTimeFormat);
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

  return (
    <>
      {dataLoadingStatus === "loading" && <LoadingSpinner />}
      {dataLoadingStatus === "error" && <ErrorContainer />}
      {allColumns && dataLoadingStatus === "success" && (
        <CloudscapeGenericTable tableColumnDefinitions={tableColumnDefinitions} allColumns={allColumns} allItems={allItems || []} itemsPerPage={itemsPerPage} />
      )}
    </>
  );
};

export default CloudscapeTable;
