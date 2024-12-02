"use client";

import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArticleProps } from "@/types/apiTypes";

export default function AccordionExpandDefault({ article }: { article: ArticleProps }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccordionChange = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Accordion
        expanded={isExpanded}
        className={`border rounded-lg ${isExpanded ? 'bg-white' : 'bg-gray-100'}`}
        onChange={handleAccordionChange}
        style={{ boxShadow: 'none' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography className="font-bold font-jakarta">{article.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            className="font-jakarta"
            dangerouslySetInnerHTML={{
              __html: (article.description_list?.join("\n") || "").replace(/\n/g, "<br><br>")
            }}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
