import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const FrameRenderer = ({
  children,
  title = "Grid Frame",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}) => {
  const [contentRef, setContentRef] = useState<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;

    const iframeBody = iframeDoc.body;

    iframeBody.style.margin = "0px";
    iframeBody.style.overflow = "hidden";

    const headChildren = Array.from(document.head.children);

    headChildren.forEach((child) => {
      iframeDoc.head.appendChild(child.cloneNode(true));
    });

    setContentRef(iframeBody);
  };

  useEffect(() => {
    if (iframeRef.current?.contentDocument?.readyState === "complete") {
      handleLoad();
    }
  }, []);

  return (
    <iframe title={title} ref={iframeRef} onLoad={handleLoad}>
      {contentRef && createPortal(children, contentRef)}
    </iframe>
  );
};
