// Column details
export interface DynamicColumnDetails {
  columnInfo: ColumnInfo;
  data: DataEntity[];
}

export interface ColumnInfo {
  tableName: string;
  sortingColumn: string;
  isAscending: boolean;
}

export interface DataEntity {
  fieldName: string;
  displayName: string;
  isColumnVisible : boolean;
  isFilterable : boolean;
  minWidth: number;
  maxWidth: number;
  metadata: Metadata;
}

export type ColumnDataType = 'externalLink' | 'link' | 'string' | 'date' | 'dateTime' | 'number' | 'boolean';

export interface Metadata {
  type: ColumnDataType;
  dateFormat?: string;
  link?: string;
}
