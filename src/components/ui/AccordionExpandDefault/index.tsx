"use client";

import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArticleProps } from "./types";

export default function AccordionExpandDefault({ article }: { article: ArticleProps }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccordionChange = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Accordion
        expanded={isExpanded}
        className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
          isExpanded
            ? "border-primary/20 bg-white shadow-md shadow-gray-900/5"
            : "border-gray-100 bg-white shadow-sm shadow-gray-900/5"
        }`}
        onChange={handleAccordionChange}
        disableGutters
        style={{ boxShadow: "none" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-primary" />}
          aria-controls="homepage-article-content"
          id="homepage-article-header"
          className="min-h-0 px-4 py-3"
        >
          <Typography className="font-jakarta text-[15px] font-bold leading-6 text-gray-900">
            {article.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="border-t border-gray-100 px-4 pb-4 pt-3">
          <Typography
            component="div"
            className="font-jakarta text-sm leading-7 text-gray-700 [&_a]:font-semibold [&_a]:text-primary [&_strong]:font-bold [&_strong]:text-gray-900"
            dangerouslySetInnerHTML={{
              __html: (article.description_list?.join("\n") || "").replace(/\n/g, "<br><br>")
            }}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
