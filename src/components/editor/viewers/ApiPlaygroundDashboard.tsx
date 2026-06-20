/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *Copyright 2026 Sanjib Bayen
 * Contact Form API Playground
 * JSON-styled form fields for sending contact messages
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Send,
  Terminal,
  Check,
  Copy,
  Globe,
  RefreshCw,
  Flame,
  X,
  Save,
  RotateCcw,
  Download,
  Mail,
  User,
  Phone,
  FileText,
  MessageSquare,
  Clock,
  HardDrive,
  FileJson,
} from "lucide-react";

// ============================================
// Types
// ============================================
interface ContactFormFields {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
}

interface ResponseState {
  status: number | null;
  statusText: string;
  time: number;
  size: string;
  headers: Array<{ key: string; value: string }>;
  body: string;
  cookies: Array<any>;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "warning" | "info";
  id: number;
}

// ============================================
// CSRF Token Helper
// ============================================
function getCsrfToken(): string {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrf_token") return value || "";
  }
  return "";
}

// ============================================
// JSON Syntax Highlighter
// ============================================
interface Token {
  type:
    | "key"
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "punctuation"
    | "whitespace"
    | "text";
  value: string;
}

function tokenizeJson(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  const stringRegex = /^"(?:[^"\\]|\\.)*"/;
  const numberRegex = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
  const wordRegex = /^(true|false|null)/;
  const whitespaceRegex = /^\s+/;

  while (index < input.length) {
    const remaining = input.slice(index);

    let match = remaining.match(whitespaceRegex);
    if (match) {
      tokens.push({ type: "whitespace", value: match[0] });
      index += match[0].length;
      continue;
    }

    const char = remaining[0];
    if (
      char === ":" ||
      char === "," ||
      char === "{" ||
      char === "}" ||
      char === "[" ||
      char === "]"
    ) {
      tokens.push({ type: "punctuation", value: char });
      index++;
      continue;
    }

    match = remaining.match(stringRegex);
    if (match) {
      const strVal = match[0];
      const afterStr = remaining.slice(strVal.length);
      const isKey = /^\s*:/.test(afterStr);
      tokens.push({ type: isKey ? "key" : "string", value: strVal });
      index += strVal.length;
      continue;
    }

    match = remaining.match(numberRegex);
    if (match) {
      tokens.push({ type: "number", value: match[0] });
      index += match[0].length;
      continue;
    }

    match = remaining.match(wordRegex);
    if (match) {
      const val = match[0];
      tokens.push({ type: val === "null" ? "null" : "boolean", value: val });
      index += val.length;
      continue;
    }

    tokens.push({ type: "text", value: char });
    index++;
  }

  return tokens;
}

function renderColorfulTokens(rawText: string): React.ReactNode {
  if (!rawText) return null;
  const tokens = tokenizeJson(rawText);
  return tokens.map((token, i) => {
    switch (token.type) {
      case "key":
        return (
          <span key={i} className="text-[#9cdcfe] font-semibold">
            {token.value}
          </span>
        );
      case "string":
        return (
          <span key={i} className="text-[#ce9178]">
            {token.value}
          </span>
        );
      case "number":
        return (
          <span key={i} className="text-[#b5cea8]">
            {token.value}
          </span>
        );
      case "boolean":
        return (
          <span key={i} className="text-[#569cd6] font-bold">
            {token.value}
          </span>
        );
      case "null":
        return (
          <span key={i} className="text-gray-500 italic">
            {token.value}
          </span>
        );
      case "punctuation":
        if (token.value === "{" || token.value === "}") {
          return (
            <span key={i} className="text-[#ffd700] font-semibold">
              {token.value}
            </span>
          );
        }
        if (token.value === "[" || token.value === "]") {
          return (
            <span key={i} className="text-[#da70d6] font-semibold">
              {token.value}
            </span>
          );
        }
        return (
          <span key={i} className="text-gray-400">
            {token.value}
          </span>
        );
      case "whitespace":
        return <span key={i}>{token.value}</span>;
      default:
        return (
          <span key={i} className="text-red-400">
            {token.value}
          </span>
        );
    }
  });
}

// ============================================
// JSON-Styled Form Field Component
// ============================================
interface JsonFormFieldInputProps {
  fieldKey: string;
  fieldType: "text" | "email" | "tel" | "textarea";
  value: string;
  placeholder: string;
  required: boolean;
  icon: React.ReactNode;
  onChange: (key: string, value: string) => void;
  disabled: boolean;
  isLast: boolean;
}

const JsonFormFieldInput: React.FC<JsonFormFieldInputProps> = React.memo(
  ({
    fieldKey,
    fieldType,
    value,
    placeholder,
    required,
    icon,
    onChange,
    disabled,
    isLast,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      onChange(fieldKey, e.target.value);
    };

    const inputBaseStyles =
      "bg-transparent text-[#ce9178] outline-none border-none p-0 m-0 font-mono text-[12px] leading-relaxed w-full min-w-[100px]";

    return (
      <div className="flex items-start py-[2px] group">
        {/* Line number */}
        <span className="text-[10px] text-gray-600 w-8 flex-shrink-0 select-none text-right pr-2 pt-[1px] font-mono opacity-50">
          &nbsp;
        </span>

        {/* Indentation */}
        <span className="text-[#ffd700] font-semibold font-mono text-[12px] mr-1 flex-shrink-0">
          {"  "}
        </span>

        {/* Key with icon */}
        <span className="text-[#9cdcfe] font-semibold font-mono text-[12px] flex-shrink-0 flex items-center">
          <span className="mr-1 opacity-70">{icon}</span>"{fieldKey}"
        </span>

        {/* Colon */}
        <span className="text-gray-400 font-mono text-[12px] mx-1 flex-shrink-0">
          :
        </span>

        {/* Value - JSON-styled input field */}
        <div className="relative flex-1 min-w-0">
          {fieldType === "textarea" ? (
            <textarea
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              rows={3}
              className={`${inputBaseStyles} resize-none bg-[#1a1a1a] rounded px-1 py-0.5 border ${
                isFocused
                  ? "border-orange-500/50 bg-[#1e1e1e]"
                  : "border-transparent hover:border-[#3e3e42]"
              } transition-all`}
              style={{ minHeight: "55px" }}
            />
          ) : (
            <input
              type={fieldType}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={`${inputBaseStyles} bg-[#1a1a1a] rounded px-1 py-0.5 border ${
                isFocused
                  ? "border-orange-500/50 bg-[#1e1e1e]"
                  : "border-transparent hover:border-[#3e3e42]"
              } transition-all`}
            />
          )}

          {/* Required indicator */}
          {required && !value.trim() && (
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-red-400 text-[10px]">
              *
            </span>
          )}
        </div>

        {/* Comma (except last field) */}
        {!isLast && (
          <span className="text-gray-400 font-mono text-[12px] flex-shrink-0">
            ,
          </span>
        )}
      </div>
    );
  },
);

JsonFormFieldInput.displayName = "JsonFormFieldInput";

// ============================================
// Main Contact Form Component
// ============================================
interface ContactApiPlaygroundProps {
  theme?: any;
  content?: string;
  triggerTerminalSimulate?: (msg: string) => void;
  openFile?: (path: string) => void;
}

export default function ContactApiPlayground({
  theme,
  content,
  triggerTerminalSimulate,
  openFile,
}: ContactApiPlaygroundProps) {
  // Refs
  const logsEndRef = useRef<HTMLDivElement>(null);
  const panelsContainerRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Form State
  const [formData, setFormData] = useState<ContactFormFields>({
    senderName: "First_name Last_name",
    senderEmail: "youremail@example.com",
    senderPhone: "+01 XXXXXXXXXX",
    subject: "Collaboration Request",
    message:
      "Hello! I would like to discuss a potential collaboration opportunity.",
  });

  // Request State
  const [requestUrl, setRequestUrl] = useState(() => {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://api.example.com";
    return `${base}/api/v1/contact`;
  });

  // Response State
  const [response, setResponse] = useState<ResponseState>({
    status: null,
    statusText: "",
    time: 0,
    size: "0 KB",
    headers: [],
    body: "",
    cookies: [],
  });

  // UI State
  const [activeResponseTab, setActiveResponseTab] = useState<
    "body" | "headers" | "cookies"
  >("body");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeBodyTab, setActiveBodyTab] = useState<"form" | "preview">(
    "form",
  );
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [requestPanelHeight, setRequestPanelHeight] = useState(55);
  const [isDragging, setIsDragging] = useState(false);

  // Field configurations
  const contactFields = [
    {
      key: "senderName",
      type: "text" as const,
      placeholder: "Enter your full name",
      required: true,
      icon: <User className="w-3.5 h-3.5" />,
    },
    {
      key: "senderEmail",
      type: "email" as const,
      placeholder: "Enter your email address",
      required: true,
      icon: <Mail className="w-3.5 h-3.5" />,
    },
    {
      key: "senderPhone",
      type: "tel" as const,
      placeholder: "Enter your phone number",
      required: false,
      icon: <Phone className="w-3.5 h-3.5" />,
    },
    {
      key: "subject",
      type: "text" as const,
      placeholder: "Enter message subject",
      required: true,
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      key: "message",
      type: "textarea" as const,
      placeholder: "Write your message here...",
      required: true,
      icon: <MessageSquare className="w-3.5 h-3.5" />,
    },
  ];

  // Generate JSON preview
  const jsonPreview = useMemo(() => {
    return JSON.stringify(formData, null, 2);
  }, [formData]);

  // Toast management
  const showToast = useCallback(
    (message: string, type: ToastState["type"] = "success") => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev.slice(-4), { message, type, id }]);
    },
    [],
  );

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Handle field changes
  const handleFieldChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(
    (text: string, field: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedField(field);
          showToast("Copied to clipboard", "success");
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => showToast("Failed to copy", "error"));
    },
    [showToast],
  );

  // Send request
  const sendRequest = useCallback(async () => {
    if (isLoading) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setIsConsoleOpen(true);
    setResponse({
      status: null,
      statusText: "",
      time: 0,
      size: "0 KB",
      headers: [],
      body: "",
      cookies: [],
    });
    setLogs([]);
    setActiveResponseTab("body");

    const startTime = performance.now();
    const addLog = (message: string) => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ${message}`,
      ]);
    };

    try {
      addLog("Preparing POST request to /api/v1/contact");
      addLog("Fetching CSRF token...");

      // FIXED: Get CSRF token before sending
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        addLog("⚠ No CSRF token found in cookies");
      } else {
        addLog("✓ CSRF token obtained");
      }

      addLog("Establishing secure connection to SMTP gateway...");

      // FIXED: Include CSRF token in headers and body
      const fetchResponse = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // ← ADDED CSRF TOKEN
          "X-Request-ID": crypto.randomUUID?.() || Math.random().toString(36),
        },
        body: JSON.stringify({
          ...formData,
          csrfToken,
        }),
        signal: abortControllerRef.current.signal,
      });

      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      addLog(
        `Response: HTTP ${fetchResponse.status} ${fetchResponse.statusText}`,
      );

      const result = await fetchResponse.json();
      const responseBody = JSON.stringify(result, null, 2);
      const responseSize = new Blob([responseBody]).size;

      // FIXED: Use actual response headers
      const responseHeaders: Array<{ key: string; value: string }> = [];
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders.push({ key, value });
      });

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        time: elapsed,
        size: `${(responseSize / 1024).toFixed(2)} KB`,
        headers:
          responseHeaders.length > 0
            ? responseHeaders
            : [
                {
                  key: "Content-Type",
                  value: "application/json; charset=utf-8",
                },
                { key: "X-Response-Time", value: `${elapsed}ms` },
              ],
        body: responseBody,
        cookies: [],
      });

      if (fetchResponse.status === 200 && result.success) {
        addLog("✓ Message delivered successfully via SMTP");
        addLog("✓ Confirmation email queued for sender");
        showToast(
          "Message sent successfully! I'll get back to you soon.",
          "success",
        );

        // Store in localStorage
        try {
          const list = JSON.parse(
            localStorage.getItem("portfolio_messages") || "[]",
          );
          list.push({
            id: `MSG-${Date.now()}`,
            ...formData,
            trackingId: result.data?.trackingId || null,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem("portfolio_messages", JSON.stringify(list));
          window.dispatchEvent(new Event("portfolio_messages_updated"));
        } catch (storageErr) {
          console.error("Storage error:", storageErr);
        }
      } else if (fetchResponse.status === 403) {
        addLog(
          `⚠ CSRF or verification error: ${result.error || result.message}`,
        );
        showToast(
          result.message || "Security check failed. Please refresh the page.",
          "warning",
        );
      } else {
        addLog(`⚠ Warning: ${result.message || "Check configuration"}`);
        showToast(result.message || "Message sent with warnings", "warning");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        addLog("Request cancelled by user");
        return;
      }

      addLog(`✗ Error: ${err.message}`);

      setResponse({
        status: 500,
        statusText: "Internal Server Error",
        time: Math.round(performance.now() - startTime),
        size: "0 KB",
        headers: [],
        body: JSON.stringify(
          {
            success: false,
            error: "Connection Error",
            message: err.message,
          },
          null,
          2,
        ),
        cookies: [],
      });

      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, formData, showToast]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      senderName: "First_name Last_name",
      senderEmail: "youremail@example.com",
      senderPhone: "+01 XXXXXXXXXX",
      subject: "Collaboration Request",
      message:
        "Hello! I would like to discuss a potential collaboration opportunity.",
    });
    setResponse({
      status: null,
      statusText: "",
      time: 0,
      size: "0 KB",
      headers: [],
      body: "",
      cookies: [],
    });
    showToast("Form reset to defaults", "info");
  }, [showToast]);

  // Save request config
  const saveRequest = useCallback(() => {
    try {
      const savedList = JSON.parse(
        localStorage.getItem("saved_api_requests") || "[]",
      );
      const requestConfig = {
        id: `REQ-${Date.now()}`,
        endpoint: "/api/v1/contact",
        method: "POST",
        formData: formData,
        timestamp: new Date().toISOString(),
      };
      savedList.push(requestConfig);
      localStorage.setItem("saved_api_requests", JSON.stringify(savedList));
      showToast("Request saved to workspace!", "success");
    } catch (e: any) {
      showToast("Failed to save request", "error");
    }
  }, [formData, showToast]);

  // Export response
  const exportResponse = useCallback(() => {
    if (!response.body) return;
    const blob = new Blob([response.body], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Response exported", "success");
  }, [response.body, showToast]);

  // Resize handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const container = panelsContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const percentage = ((e.clientY - rect.top) / rect.height) * 100;
      setRequestPanelHeight(Math.min(Math.max(percentage, 25), 75));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        sendRequest();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [sendRequest]);

  return (
    <div className="w-full h-full flex min-h-0 bg-[#1e1e1e] text-gray-300 font-sans overflow-auto select-none">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#252526] border-b border-[#2d2d2d] flex items-center px-4 z-10">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-gray-300">
            Contact API
          </span>
          <span className="text-[10px] text-gray-500 ml-2">
            POST /api/v1/contact
          </span>
        </div>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-500 flex items-center">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
          SMTP Connected
        </span>
      </div>

      {/* URL Bar */}
      <div className="absolute top-10 left-0 right-0 p-2 border-b border-[#2d2d2d] bg-[#252526] z-10">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold px-3 py-1.5 rounded flex-shrink-0">
            POST
          </span>

          <div className="flex-1 flex items-center bg-[#3c3c3c] rounded border border-[#4d4d4d] focus-within:ring-1 focus-within:ring-orange-500">
            <Globe className="w-3.5 h-3.5 text-gray-500 ml-2.5 flex-shrink-0" />
            <input
              type="text"
              value={requestUrl}
              onChange={(e) => setRequestUrl(e.target.value)}
              className="flex-1 bg-transparent px-2 py-1.5 text-[11px] font-mono outline-none"
              placeholder="Enter request URL"
            />
          </div>

          <button
            onClick={sendRequest}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-semibold text-[11px] rounded transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
            title="Send Request (Ctrl+Enter)"
          >
            {isLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            <span>Send</span>
          </button>

          <button
            onClick={resetForm}
            className="p-1.5 hover:bg-[#3e3e42] rounded transition-colors"
            title="Reset Form"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={saveRequest}
            className="p-1.5 hover:bg-[#3e3e42] rounded transition-colors"
            title="Save Request"
          >
            <Save className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={panelsContainerRef}
        className="flex-1 flex flex-col min-h-0 mt-[84px] overflow-auto"
      >
        {/* Request Panel - JSON-Styled Form */}
        <div
          style={{ height: `${requestPanelHeight}%`, minHeight: "220px" }}
          className="border-b border-[#2d2d2d] overflow-auto flex flex-col"
        >
          <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#2d2d2d] bg-[#2d2d2d] min-h-[30px]">
              <div className="flex">
                <button
                  onClick={() => setActiveBodyTab("form")}
                  className={`px-3 py-1 text-[11px] font-semibold transition-all duration-150 ${
                    activeBodyTab === "form"
                      ? "text-white border-b-2 border-orange-500 bg-[#1e1e1e]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Body
                </button>
                <button
                  onClick={() => setActiveBodyTab("preview")}
                  className={`px-3 py-1 text-[11px] font-semibold transition-all duration-150 ${
                    activeBodyTab === "preview"
                      ? "text-white border-b-2 border-orange-500 bg-[#1e1e1e]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="flex-1" />
              <span className="text-[10px] text-gray-500 px-2">JSON</span>
            </div>

            {/* Form/Body Content */}
            <div className="flex-1 overflow-auto bg-[#1e1e1e] font-mono custom-scrollbar">
              {activeBodyTab === "form" ? (
                <div className="py-3">
                  {/* Opening brace */}
                  <div className="flex items-start py-[2px]">
                    <span className="text-[10px] text-gray-600 w-8 flex-shrink-0 select-none text-right pr-2 font-mono opacity-50">
                      1
                    </span>
                    <span className="text-[#ffd700] font-semibold text-[12px]">
                      {"{"}
                    </span>
                  </div>

                  {/* Form fields as JSON lines */}
                  {contactFields.map((field, index) => (
                    <JsonFormFieldInput
                      key={field.key}
                      fieldKey={field.key}
                      fieldType={field.type}
                      value={formData[field.key as keyof ContactFormFields]}
                      placeholder={field.placeholder}
                      required={field.required}
                      icon={field.icon}
                      onChange={handleFieldChange}
                      disabled={isLoading}
                      isLast={index === contactFields.length - 1}
                    />
                  ))}

                  {/* Closing brace */}
                  <div className="flex items-start py-[2px]">
                    <span className="text-[10px] text-gray-600 w-8 flex-shrink-0 select-none text-right pr-2 font-mono opacity-50">
                      {contactFields.length + 2}
                    </span>
                    <span className="text-[#ffd700] font-semibold text-[12px]">
                      {"}"}
                    </span>
                  </div>

                  {/* Help text */}
                  <div className="mt-4 px-8 text-[10px] text-gray-500">
                    <span className="text-[#9cdcfe]">Tip:</span> Fill in your
                    contact details above. Switch to
                    <span className="text-[#ce9178] mx-1">Preview</span>
                    to see the JSON payload, then click
                    <span className="text-white font-semibold mx-1">Send</span>
                    to deliver your message via SMTP.
                  </div>
                </div>
              ) : (
                /* JSON Preview */
                <div className="h-full">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#2d2d2d]">
                    <span className="text-[10px] text-gray-400">
                      Generated JSON Preview
                    </span>
                    <button
                      onClick={() => copyToClipboard(jsonPreview, "preview")}
                      className="p-1 hover:bg-[#3e3e42] rounded transition-colors"
                    >
                      {copiedField === "preview" ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] p-3 overflow-auto h-full custom-scrollbar whitespace-pre-wrap break-all">
                    <code>{renderColorfulTokens(jsonPreview)}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`h-1 bg-[#2d2d2d] cursor-row-resize hover:bg-orange-500/50 transition-colors flex-shrink-0 ${
            isDragging ? "bg-orange-500" : ""
          }`}
        />

        {/* Response Panel */}
        <div className="flex-1 min-h-[220px] bg-[#1e1e1e] overflow-auto flex flex-col">
          {/* Response Header */}
          <div className="flex items-center px-3 py-0.5 bg-[#252526] border-b border-[#2d2d2d] min-h-[24px] flex-shrink-0">
            <div className="flex items-center space-x-3">
              {response.status && (
                <>
                  <span
                    className={`text-[11px] font-bold ${
                      response.status >= 200 && response.status < 300
                        ? "text-green-400"
                        : response.status >= 400 && response.status < 500
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {response.time}ms
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center">
                    <HardDrive className="w-3 h-3 mr-1" />
                    {response.size}
                  </span>
                </>
              )}
            </div>
            <div className="flex-1" />
            {response.body && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={exportResponse}
                  className="p-1 hover:bg-[#3e3e42] rounded transition-colors"
                  title="Export Response"
                >
                  <Download className="w-3 h-3 text-gray-400" />
                </button>
                <button
                  onClick={() => copyToClipboard(response.body, "response")}
                  className="p-1 hover:bg-[#3e3e42] rounded transition-colors"
                  title="Copy Response"
                >
                  {copiedField === "response" ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Response Tabs */}
          <div className="flex border-b border-[#2d2d2d] bg-[#2d2d2d] flex-shrink-0">
            {(["body", "headers", "cookies"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveResponseTab(tab)}
                className={`px-3 py-1 text-[11px] font-semibold capitalize transition-all duration-150 ${
                  activeResponseTab === tab
                    ? "text-white border-b-2 border-orange-500 bg-[#1e1e1e]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Response Content */}
          <div className="flex-1 overflow-auto p-3">
            {activeResponseTab === "body" && (
              <div className="h-full">
                {response.body ? (
                  <pre className="text-[11px] font-mono text-gray-300 bg-[#1e1e1e] p-3 rounded border border-[#3e3e42] overflow-auto h-full custom-scrollbar whitespace-pre-wrap break-all">
                    <code>{renderColorfulTokens(response.body)}</code>
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FileJson className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-[11px] font-semibold mb-1">
                      No Response Yet
                    </p>
                    <p className="text-[10px]">
                      Click Send to submit your message
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeResponseTab === "headers" && (
              <div className="h-full">
                {response.headers.length > 0 ? (
                  <div className="border border-[#3e3e42] rounded overflow-hidden">
                    <table className="w-full text-[10px] font-mono">
                      <thead>
                        <tr className="bg-[#2d2d2d]">
                          <th className="text-left px-2 py-1 font-semibold text-gray-300">
                            Header
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-gray-300">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {response.headers.map((header, i) => (
                          <tr
                            key={i}
                            className="border-t border-[#2d2d2d] hover:bg-[#2a2a2e]"
                          >
                            <td className="px-2 py-1 text-yellow-400">
                              {header.key}
                            </td>
                            <td className="px-2 py-1 text-gray-300 break-all">
                              {header.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-[11px]">
                      Response headers will appear here
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeResponseTab === "cookies" && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-[11px]">No cookies stored</p>
              </div>
            )}
          </div>

          {/* Console */}
          <div
            className={`border-t border-[#2d2d2d] bg-[#1a1a1a] overflow-hidden flex flex-col flex-shrink-0 transition-all duration-200 ${
              isConsoleOpen ? "h-28" : "h-[26px]"
            }`}
          >
            <div
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="flex items-center px-3 py-1 bg-[#202021] border-b border-[#2d2d2d]/30 min-h-[25px] cursor-pointer hover:bg-[#2a2a2e]/60 transition-colors select-none"
            >
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Console
                </span>
                {logs.length > 0 && (
                  <span className="ml-1 bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono leading-none">
                    {logs.length}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLogs([]);
                }}
                className="ml-auto text-[10px] text-gray-500 hover:text-gray-300 transition-colors px-1 hover:underline"
              >
                Clear
              </button>
            </div>

            {isConsoleOpen && (
              <div className="flex-1 p-2 overflow-y-auto text-[10px] font-mono text-gray-400 custom-scrollbar bg-[#161617]/95">
                {logs.length === 0 ? (
                  <span className="text-gray-600">
                    Execution logs will appear here...
                  </span>
                ) : (
                  logs.map((log, i) => (
                    <div
                      key={i}
                      className="py-0.5 leading-relaxed hover:bg-neutral-800/10 px-1 border-l border-transparent hover:border-orange-500/30"
                    >
                      {log}
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-1.5">
        {toasts.map((toast) => (
          <div key={toast.id} className="animate-slide-up">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-2xl border text-[11px] font-semibold ${
                toast.type === "success"
                  ? "bg-green-900/95 border-green-700 text-green-200"
                  : toast.type === "error"
                    ? "bg-red-900/95 border-red-700 text-red-200"
                    : toast.type === "warning"
                      ? "bg-yellow-900/95 border-yellow-700 text-yellow-200"
                      : "bg-blue-900/95 border-blue-700 text-blue-200"
              }`}
            >
              {toast.type === "success" && (
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              {toast.type === "error" && (
                <X className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="flex-shrink-0 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4d4d4d;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6d6d6d;
        }
      `}</style>
    </div>
  );
}
