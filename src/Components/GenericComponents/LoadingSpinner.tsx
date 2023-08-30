import { Box, Spinner } from "@cloudscape-design/components";
import * as React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <>
      <Box margin="xxl" padding={"xxl"} textAlign="center">
        <Spinner size="large"/>
      </Box>
    </>
  );
};

export default LoadingSpinner;
