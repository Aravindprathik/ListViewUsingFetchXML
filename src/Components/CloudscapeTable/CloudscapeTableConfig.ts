import { FilteringProperty, PropertyFilterProps } from "@cloudscape-design/components/property-filter/interfaces";
import { ColumnDataType, DataEntity, DynamicColumnDetails } from "./CloudscapeInterface";
import { CollectionPreferencesProps, TableProps } from "@cloudscape-design/components";
import { getDataToDisplay } from "./CellComponents";

export const DEFAULT_PAGE_SIZE_IS_100 = 100;
export const BLANK_SEARCH_AND = {
  tokens: [],
  operation: "and",
} as PropertyFilterProps.Query;

export function extractFieldNamesForDefaultVisibleContent(dynamicColumnDetails: DynamicColumnDetails): string[] {
  return dynamicColumnDetails.data.map((dataEntity: DataEntity) => dataEntity.fieldName);
}

export function generateVisibleContentOptions(dynamicColumnDetails: DynamicColumnDetails): CollectionPreferencesProps.VisibleContentOptionsGroup[] {
  const groups: CollectionPreferencesProps.VisibleContentOptionsGroup[] = [
    {
      label: 'Properties', // You can customize the label as needed
      options: dynamicColumnDetails.data.map((dataEntity: DataEntity) => ({
        id: dataEntity.fieldName,
        label: dataEntity.displayName,
        editable: false,
      })),
    },
  ];
  return groups;
}

export function generateFilteringProperties(dynamicColumnDetails: DynamicColumnDetails): FilteringProperty[] {
  const filteringProperties: FilteringProperty[] = dynamicColumnDetails.data.map((dataEntity: DataEntity) => {
    const dataType: ColumnDataType = dataEntity.metadata.type;
    let operators: string[] = [];

    if (dataType === 'string') {
      operators = [":", "!:", "=", "!="];
    } else if (dataType === 'number') {
      operators = ['=', '!=', '<', '<=', '>', '>='];
    } else if (dataType === 'date' || dataType === 'dateTime') {
      operators = ['=', '!=', '<', '<=', '>', '>='];
    } else {
      operators = [":", "!:", "=", "!="];
    }

    return {
      key: dataEntity.fieldName,
      propertyLabel: dataEntity.displayName,
      groupValuesLabel: `${dataEntity.displayName} values`,
      operators,
    } as FilteringProperty;
  });

  return filteringProperties;
}

export function generateColumnDefinitions(dynamicColumnDetails: DynamicColumnDetails): TableProps.ColumnDefinition<DataEntity>[] {
  const columnDefinitions: TableProps.ColumnDefinition<DataEntity>[] = dynamicColumnDetails.data.map((dataEntity: DataEntity) => {
    return {
      id: dataEntity.fieldName,
      header: dataEntity.displayName,
      width: dataEntity.minWidth,
      cell: (item: any) => getDataToDisplay(item, dataEntity),
    } as TableProps.ColumnDefinition<DataEntity>;
  });

  return columnDefinitions;
}
