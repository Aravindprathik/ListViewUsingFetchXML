// Column details
export interface DynamicColumnDetails {
  columnInfo: ColumnInfo;
  data: DataEntity[];
}

export interface ColumnInfo {
  sortingColumn: string;
  isAscending: boolean;
}

export interface DataEntity {
  fieldName: string;
  displayName: string;
  minWidth: number;
  maxWidth: number;
  metadata: Metadata;
}

export type ColumnDataType = 'link' | 'string' | 'date' | 'dateTime' | 'number' | 'boolean';

export interface Metadata {
  type: ColumnDataType;
  dateFormat?: string;
}
