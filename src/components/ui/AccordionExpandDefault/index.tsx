"use client";

import { useState } from "react";
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
  const panelId = `homepage-article-content-${article.display_id}`;
  const buttonId = `homepage-article-header-${article.display_id}`;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
        isExpanded
          ? "border-primary/20 shadow-md shadow-gray-900/5"
          : "border-gray-100 shadow-sm shadow-gray-900/5"
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="font-jakarta text-[15px] font-bold leading-6 text-gray-900">
          {article.title}
        </span>
        <ExpandMoreIcon
          className={`h-5 w-5 flex-shrink-0 text-primary transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="border-t border-gray-100 px-4 pb-4 pt-3 font-jakarta"
        >
          <ArticleContent descriptions={article.description_list} />
        </div>
      )}
    </article>
  );
}
