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
        className="border rounded-lg bg-gray-100 animate-pulse"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="div" style={{ fontWeight: "bold" }} className="font-jakarta bg-gray-300 w-1/2 h-6 rounded"></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div" className="font-jakarta">
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded"></div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionSkeleton;