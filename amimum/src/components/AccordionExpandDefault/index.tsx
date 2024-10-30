import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AccordionExpandDefaultProps { 
  title: string;
  content: string;
}

export default function AccordionExpandDefault({ title, content }: AccordionExpandDefaultProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleAccordionChange = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Accordion
        expanded={isExpanded}
        className={`border rounded-lg ${isExpanded ? 'bg-white' : 'bg-gray-100'}`}
        onChange={handleAccordionChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography className="font-bold font-jakarta">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="font-jakarta">
            {content}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
