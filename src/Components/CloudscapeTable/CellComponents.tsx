import * as React from "react";
import { DataEntity } from "./CloudscapeInterface";
import * as moment from "moment-timezone";

export const getDataToDisplay = (item: any, dataEntity: DataEntity) => {
  const dataType = dataEntity.metadata.type;
  const data = item[dataEntity.fieldName] ? item[dataEntity.fieldName] : "";

  switch (dataType) {
    case "date":
      if (data) {
        const desiredFormat = dataEntity?.metadata?.dateFormat ? dataEntity?.metadata?.dateFormat : "YYYY-MM-DD";
        return moment(data).format(desiredFormat);
      }
      return ""; // Use your desired format
    case "dateTime":
      if (data) {
        const desiredFormat = dataEntity?.metadata?.dateFormat ? dataEntity?.metadata?.dateFormat : "YYYY-MM-DD HH:mm:ss";
        return moment(data).format(desiredFormat);
      }
      return "";
    case "boolean":
      return data ? "Yes" : "No";
    default:
      return (
        <>
          <span>{`${data}`}</span>
        </>
      );
  }
};
