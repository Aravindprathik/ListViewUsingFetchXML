import { Box } from "@cloudscape-design/components";
import * as React from "react";

const ErrorContainer: React.FC = () => {
  return (
    <>
      <Box margin="xxl" padding={"xxl"} textAlign="center">
        <p>
          <strong>{"Error fetching records"}</strong>
        </p>
      </Box>
    </>
  );
};

export default ErrorContainer;
