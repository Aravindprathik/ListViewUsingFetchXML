import { TableProps } from "@cloudscape-design/components";
import  moment from "moment-timezone";
import * as React from "react";
import { useEffect } from "react";
import { IInputs } from "../../generated/ManifestTypes";
import ErrorContainer from "../GenericComponents/ErrorContainer";
import LoadingSpinner from "../GenericComponents/LoadingSpinner";
import { DefaultDateFormat, DefaultDateTimeFormat } from "./CellComponents";
import { CloudscapeGenericTable } from "./CloudscapeGenericTable";
import { DynamicColumnDetails } from "./CloudscapeInterface";
import {
  generateColumnDefinitions
} from "./CloudscapeTableConfig";

export interface KPIDataLoaderProps {
  kpiEntityId: string | null;
  kpiEntityName: string | null;
  pcfContext: ComponentFramework.Context<IInputs>;
  itemsPerPage: number;
}
export const KPIDataLoader: React.FC<KPIDataLoaderProps> = ({ kpiEntityId, kpiEntityName, pcfContext, itemsPerPage }) => {
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
  }, [allColumns, pcfContext, primaryEntity]);

  useEffect(() => {
    dynamicsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pcfContext]);

  const dynamicsHandler = async () => {
    setDataLoadingStatus("loading");

    try {
      if (kpiEntityId) {
        var fetchData = {
          cb_kpimasterdataid: kpiEntityId,
        };
        // console.log("fetchData.cb_kpimasterdataid", fetchData.cb_kpimasterdataid);
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
          kpiEntityId,
          "'/>",
          "    </filter>",
          "  </entity>",
          "</fetch>",
        ].join("");

        pcfContext.webAPI.retrieveMultipleRecords("cb_kpimasterdata", "?fetchXml=" + encodeURIComponent(fetchXml)).then(
          (results: any) => {
            if (results && results.entities && results.entities.length > 0) {
              var firstKpiEntity = results.entities;
              let cb_fetchxml = firstKpiEntity[0].cb_fetchxml;
              let _columnlayout = firstKpiEntity[0].cb_columnlayout;
              let _finalColumnLayout = _columnlayout != null ? JSON.parse(_columnlayout) : null;
              let fetchXML_AllItems = cb_fetchxml.replace(/"/g, "'");
              const _primaryEntityName = getPrimaryEntityNameFromFetchXml(fetchXML_AllItems);

              setPrimaryEntityName(_primaryEntityName);
              console.log("_finalColumnLayout ", JSON.stringify(_finalColumnLayout));
              setAllColumns(_finalColumnLayout);

              pcfContext.webAPI.retrieveMultipleRecords(_primaryEntityName, "?fetchXml=" + encodeURIComponent(fetchXML_AllItems)).then(
                (results: any) => {
                  if (results && results.entities && results.entities.length > 0) {
                    const rawItemData = results.entities;
                    const parsedData = modifyRowData(rawItemData, _finalColumnLayout);
                    console.log("modifyRowData ", JSON.stringify(parsedData));
                    setAllItems(parsedData);
                  }

                  setDataLoadingStatus("success");
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

      allColumns.data.forEach((dataEntity) => {
        if (dataEntity.fieldName in row) {
          let originalData = row[dataEntity.fieldName];

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

