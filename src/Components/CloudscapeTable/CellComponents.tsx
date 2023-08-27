import React = require("react");
import { DataEntity } from "./CloudscapeInterface";

export const getDataToDisplay: React.FC = (item: any, dataEntity: DataEntity) => {
  const dataType = dataEntity.metadata.type;

  switch (dataType) {
    case "date":
      return new Date(item[dataEntity.fieldName]).toLocaleDateString();
    case "dateTime":
      return new Date(item[dataEntity.fieldName]).toLocaleString();
    case "boolean":
      return item[dataEntity.fieldName] ? "Yes" : "No";
    default:
      return item[dataEntity.fieldName];
  }
};
interface StringCellProps {
  data: string;
}

export const StringCell: React.FC<StringCellProps> = ({ data }: any) => {
  // Custom rendering logic for string data
  return <div>{data}</div>;
};

interface NumberCellProps {
  data: number;
}

export const NumberCell: React.FC<NumberCellProps> = ({ data }: any) => {
  // Custom rendering logic for number data
  return <div>{data}</div>;
};
