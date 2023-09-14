import * as React from "react";
import { DataEntity } from "./CloudscapeInterface";
import { Box, Link } from "@cloudscape-design/components";
import  moment from "moment-timezone";

export const DefaultDateFormat = "MM/DD/YYYY";
export const DefaultDateTimeFormat = "MM/DD/YYYY hh:mm A";

//const _FORMATTEDVALUE = "@OData.Community.Display.V1.FormattedValue";

export const getDataToDisplay = (
  item: any,
  dataEntity: DataEntity,
  pcfContext: any,
  primaryEntityName: string
) => {
  const dataType = dataEntity.metadata.type;
  const data = item[dataEntity.fieldName] ? item[dataEntity.fieldName] : "";

  switch (dataType) {
    case "link":
      if (data) {
        const handleCLick = () => {
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
          <Link external href={dataEntity.metadata.link + data|| ""}>
            {data || 'external link'}
          </Link>
        );
      }
      return "";
    default:
      return (
        <>
          <Box>{`${data}`}</Box>
          {/* Future examles  */}
          {/* <Box textAlign="center">{`${data}`}</Box> */}
        </>
      );
  }
};