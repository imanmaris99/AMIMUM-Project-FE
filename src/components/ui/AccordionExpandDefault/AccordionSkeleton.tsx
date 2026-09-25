import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AccordionSkeleton = () => {
  return (
    <div>
      <Accordion
        expanded={false}
        disableGutters
        className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-900/5"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-gray-300" />}
          aria-controls="homepage-article-skeleton-content"
          id="homepage-article-skeleton-header"
          className="min-h-0 px-4 py-3"
        >
          <Typography component="div" className="h-5 w-2/3 rounded bg-gray-200 font-jakarta" />
        </AccordionSummary>
        <AccordionDetails className="border-t border-gray-100 px-4 pb-4 pt-3">
          <Typography component="div" className="font-jakarta">
            <div className="mb-2 h-3.5 rounded bg-gray-200" />
            <div className="mb-2 h-3.5 w-11/12 rounded bg-gray-200" />
            <div className="h-3.5 w-8/12 rounded bg-gray-200" />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionSkeleton;