import { Box } from "@cloudscape-design/components";
import * as React from "react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}
export function EmptyStateMessage({ title, subtitle, action }: EmptyStateProps) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: "s" }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
}
