"use client";

import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArticleProps } from "./types";

const sectionMarkerPattern = /^[^\p{L}\p{N}#]/u;

const isSectionHeading = (text: string) => {
  const trimmed = text.trim();
  return trimmed.length > 0 && sectionMarkerPattern.test(trimmed) && trimmed.length <= 60;
};

const isTagLine = (text: string) => text.trim().startsWith("#");

const isShortHighlight = (text: string) => {
  const trimmed = text.trim();
  return (
    trimmed.length > 0 &&
    trimmed.length <= 34 &&
    !/[.!?]$/.test(trimmed) &&
    !trimmed.includes(":")
  );
};

const ArticleContent = ({ descriptions }: { descriptions?: string[] }) => {
  const lines = (descriptions || [])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  if (lines.length === 0) {
    return (
      <p className="rounded-xl bg-gray-50 px-3 py-3 text-sm leading-6 text-gray-500">
        Isi artikel belum tersedia.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        if (isTagLine(line)) {
          const tags = line
            .split(/\s+#/)
            .map((tag, tagIndex) => (tagIndex === 0 ? tag.replace(/^#/, "") : tag))
            .map((tag) => tag.trim())
            .filter(Boolean);

          return (
            <div key={`${line}-${index}`} className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold leading-5 text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          );
        }

        if (isSectionHeading(line)) {
          return (
            <div
              key={`${line}-${index}`}
              className={index === 0 ? "pt-0" : "pt-2"}
            >
              <p className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-sm font-bold leading-6 text-primary">
                {line}
              </p>
            </div>
          );
        }

        if (isShortHighlight(line)) {
          return (
            <div key={`${line}-${index}`} className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <p className="text-sm font-semibold leading-6 text-gray-800">{line}</p>
            </div>
          );
        }

        return (
          <p key={`${line}-${index}`} className="text-sm leading-7 text-gray-700">
            {line}
          </p>
        );
      })}
    </div>
  );
};

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
        disableGutters
        style={{ boxShadow: "none" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-primary" />}
          aria-controls="homepage-article-content"
          id="homepage-article-header"
          className="min-h-0 px-4 py-3"
          onClick={handleAccordionChange}
        >
          <Typography className="font-jakarta text-[15px] font-bold leading-6 text-gray-900">
            {article.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="border-t border-gray-100 px-4 pb-4 pt-3">
          <div className="font-jakarta">
            <ArticleContent descriptions={article.description_list} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
