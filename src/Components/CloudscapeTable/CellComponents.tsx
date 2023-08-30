import * as React from "react";
import { DataEntity } from "./CloudscapeInterface";
import * as moment from "moment-timezone";
import { Link } from "@cloudscape-design/components";
import { IInputs } from "../../generated/ManifestTypes";


const _LOOKUPLOGICALNAMEATTRIBUTE = "@Microsoft.Dynamics.CRM.lookuplogicalname";
const _FORMATTEDVALUE = "@OData.Community.Display.V1.FormattedValue";
const _ATTRIBUTENAME = "@OData.Community.Display.V1.AttributeName";

export const getDataToDisplay = (
  item: any,
  dataEntity: DataEntity,
  pcfContext: ComponentFramework.Context<IInputs>,
  primaryEntityName: string
) => {
  const dataType = dataEntity.metadata.type;
  let data = item[dataEntity.fieldName] ? item[dataEntity.fieldName] : "";


  if (item[dataEntity.fieldName + _FORMATTEDVALUE]) {
    data = item[dataEntity.fieldName + _FORMATTEDVALUE];
  }

  switch (dataType) {
    case "date":
      if (data) {
        const desiredFormat = dataEntity?.metadata?.dateFormat
          ? dataEntity?.metadata?.dateFormat
          : "YYYY-MM-DD";
        return moment(data).format(desiredFormat);
      }
      return ""; // Use your desired format
    case "dateTime":
      if (data) {
        const desiredFormat = dataEntity?.metadata?.dateFormat
          ? dataEntity?.metadata?.dateFormat
          : "YYYY-MM-DD HH:mm:ss";
        return moment(data).format(desiredFormat);
      }
      return "";
    case "boolean":
      return data ? "Yes" : "No";
    case "link":
      if (data) {
        const handleCLick = () => {
          console.log("handleCLick ", primaryEntityName);
          pcfContext.navigation.openForm({
            entityName: primaryEntityName,
            entityId: item[primaryEntityName + "id"],
          });
        };
        return <Link onFollow={() => handleCLick()}>{data}</Link>;
      }
      return "";
    case "externalLink":
      if (data) {
        return (
          <Link external href={dataEntity.metadata.link || ""}>
            {data || 'external link'}
          </Link>
        );
      }
      return "";
    default:
      return (
        <>
          <span>{`${data}`}</span>
        </>
      );
  }
};

// this._pcfContext.navigation.openForm({
//   entityName: this._primaryEntityName,
//   entityId: item[this._primaryEntityName + "id"]
// });
