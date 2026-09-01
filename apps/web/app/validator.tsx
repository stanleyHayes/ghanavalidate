"use client";
import { normalizeGhanaPhone, normalizeGhanaPostAddress, normalizeGhanaText } from "@digitalghana/validate";
import { useMemo, useState } from "react";

const tools = [{ id: "phone", label: "Phone", placeholder: "024 123 4567", example: "024 123 4567" }, { id: "postal", label: "Digital address", placeholder: "GA-543-0125", example: "GA-543-0125" }, { id: "text", label: "Text", placeholder: "  Ama   Mensah  ", example: "  Ama   Mensah  " }] as const;
type ToolId = typeof tools[number]["id"];

export function Validator() {
  const [active, setActive] = useState<ToolId>("phone"); const selected = tools.find((tool) => tool.id === active) ?? tools[0]; const [value, setValue] = useState<string>(selected.example);
  const result = useMemo(() => active === "phone" ? normalizeGhanaPhone(value) : active === "postal" ? normalizeGhanaPostAddress(value) : normalizeGhanaText(value), [active, value]);
  function choose(id: ToolId) { const tool = tools.find((item) => item.id === id) ?? tools[0]; setActive(id); setValue(tool.example); }
  return <section className="workbench" aria-labelledby="workbench-title"><div className="workbench-head"><div><p className="section-label">Live workbench</p><h2 id="workbench-title">Try the local rules.</h2></div><p>No input leaves your browser.</p></div><div className="tool-tabs" role="tablist" aria-label="Validation tools">{tools.map((tool) => <button key={tool.id} type="button" role="tab" aria-selected={active === tool.id} onClick={() => choose(tool.id)}>{tool.label}</button>)}</div><div className="workbench-grid"><div className="input-panel"><label htmlFor="validator-input">Input</label><input id="validator-input" value={value} placeholder={selected.placeholder} onChange={(event) => setValue(event.target.value)} autoComplete="off" /><p>Try spaces, punctuation or local/international formatting.</p></div><div className={`result-panel ${result.valid ? "is-valid" : "is-invalid"}`} aria-live="polite"><div className="result-status"><span>{result.valid ? "Normalized" : "Needs attention"}</span><code>{result.reasonCode}</code></div><pre>{JSON.stringify(result.normalizedValue, null, 2)}</pre><div className="rule"><span>{result.rule.id}</span><span>v{result.rule.version}</span></div>{result.warnings.map((warning) => <p className="warning" key={warning}>{warning.replaceAll("_", " ").toLocaleLowerCase("en-GH")}</p>)}</div></div></section>;
}
