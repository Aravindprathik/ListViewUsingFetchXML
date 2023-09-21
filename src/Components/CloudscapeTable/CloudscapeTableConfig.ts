import {
  FilteringProperty,
  PropertyFilterProps,
} from "@cloudscape-design/components/property-filter/interfaces";
import {
  ColumnDataType,
  DataEntity,
  DynamicColumnDetails,
} from "./CloudscapeInterface";
import {
  CollectionPreferencesProps,
  TableProps,
} from "@cloudscape-design/components";
import { getDataToDisplay } from "./CellComponents";
import { IInputs } from "../../generated/ManifestTypes";
import moment from "moment-timezone";

export const DEFAULT_PAGE_SIZE_IS_20 = 20;
export const BLANK_SEARCH_AND = {
  tokens: [],
  operation: "and",
} as PropertyFilterProps.Query;

export function extractFieldNamesForDefaultVisibleContent(
  dynamicColumnDetails: DynamicColumnDetails
): string[] {
  return dynamicColumnDetails.data.map(
    (dataEntity: DataEntity) => dataEntity.fieldName
  );
}

export function generateVisibleContentOptions(
  dynamicColumnDetails: DynamicColumnDetails | undefined
): CollectionPreferencesProps.VisibleContentOptionsGroup[] {
  if (dynamicColumnDetails) {
    const groups: CollectionPreferencesProps.VisibleContentOptionsGroup[] = [
      {
        label: "Properties", // You can customize the label as needed
        options: dynamicColumnDetails?.data.map((dataEntity: DataEntity) => ({
          id: dataEntity.fieldName,
          label: dataEntity.displayName,
          editable: dataEntity.isColumnVisible || false,
        })),
      },
    ];
    return groups;
  }

  return [];
}

export function generateColumnDefinitions(
  dynamicColumnDetails: DynamicColumnDetails,
  pcfContext: ComponentFramework.Context<IInputs>,
  primaryEntityName: string
): TableProps.ColumnDefinition<DataEntity>[] {
  const columnDefinitions: TableProps.ColumnDefinition<DataEntity>[] =
    dynamicColumnDetails.data.map((dataEntity: DataEntity) => {
      return {
        id: dataEntity.fieldName,
        header: dataEntity.displayName,
        width: dataEntity.minWidth | 150,
        minWidth: dataEntity.minWidth | 150,
        maxWidth: dataEntity.maxWidth | 200,
        cell: (item: any) => getDataToDisplay(item, dataEntity, pcfContext, primaryEntityName),
        sortingField: dataEntity.fieldName,
        sortingComparator: (a: any, b: any) => {
          if (dataEntity.metadata.type === "dateTime" || (dataEntity.metadata.type === "date")) {
            return moment(a[dataEntity.fieldName]).isBefore(b[dataEntity.fieldName]) ? -1 : 1;
          }

          return a[dataEntity.fieldName]?.localeCompare(b[dataEntity.fieldName]);
        },
      } as TableProps.ColumnDefinition<DataEntity>;
    });

  return columnDefinitions;
}
