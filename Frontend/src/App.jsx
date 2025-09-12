import React, { useEffect, useState } from "react";
import {
  Play,
  Copy,
  Download,
  Settings,
  Maximize2,
  Code2,
  Eye,
  FileText,
  Zap,
  RefreshCw,
  Save,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate fibonacci for numbers 0-10
for (let i = 0; i <= 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}`);
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");

  // Calculate line numbers
  const lines = code.split("\n");
  const lineCount = lines.length;

  // Handle run button click
  const handleRun = async () => {
    setIsRunning(true);
    setOutput("🔄 Analyzing code...\n\n");

    await generateCodeReview(code);
    setIsRunning(false)
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  // Generate mock code review
  const generateCodeReview = async (code) => {
    try {
      const response = await axios.post(`${apiUrl}/ai/get-response`, { code });
      if (response.status) {
        setOutput(response.data.reply);
      }
    } catch (error) {
      console.log("Error from API:", error);
    }
  };

  // Handle copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  // Handle save
  const handleSave = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language === "javascript" ? "js" : language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-semibold text-white">CodeReviewer</h1>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            title="Save File"
          >
            <Save className="w-4 h-4" />
          </button>
          {/* <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button> */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Review Code</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
          {/* Editor Header */}
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Editor</span>
              <span className="text-xs text-gray-500">({language})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Lines: {lineCount}</span>
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Input Area */}
          <div className="flex-1 flex bg-gray-900">
            {/* Line Numbers */}
            <div className="bg-gray-850 border-r border-gray-700 px-3 py-4 text-xs text-gray-500 select-none min-w-[60px]">
              <div
                className="font-mono leading-6"
                style={{
                  fontFamily: "Fira Code, Consolas, Monaco, monospace",
                  lineHeight: "24px",
                }}
              >
                {lines.map((_, index) => (
                  <div
                    key={index}
                    className="text-right h-6 flex items-center justify-end"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none border-none"
                style={{
                  fontFamily: "Fira Code, Consolas, Monaco, monospace",
                  lineHeight: "24px",
                  tabSize: "2",
                }}
                placeholder="Write your code here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Review Output */}
        <div className="flex-1 flex flex-col">
          {/* Output Header */}
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Code Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isRunning ? "bg-yellow-500" : "bg-green-500"
                  }`}
                ></div>
                <span className="text-xs text-gray-400">
                  {isRunning ? "Analyzing" : "Ready"}
                </span>
              </div>
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Review Output Area */}
          <div className="flex-1 bg-gray-900 p-4">
            <div className="h-full bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-auto border border-gray-800">
              {output ? (
                <div className="text-gray-200 whitespace-pre-wrap">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {output}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="mb-4">
                    💡 <span className="text-blue-400">CodeReviewer</span> -
                    AI-powered code analysis
                  </div>
                  <div className="mb-2">
                    Click "Review Code" to analyze your code for:
                  </div>
                  <ul className="list-disc list-inside space-y-1 mb-4 text-gray-400">
                    <li>Code structure and best practices</li>
                    <li>Performance optimization suggestions</li>
                    <li>Security vulnerabilities</li>
                    <li>Code complexity analysis</li>
                    <li>Improvement recommendations</li>
                  </ul>
                  <div className="flex items-center text-gray-600">
                    <span className="animate-pulse mr-2">▶</span>
                    Ready to analyze your code...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Lines: {lineCount}</span>
          <span>Characters: {code.length}</span>
          <span>
            Words: {code.split(/\s+/).filter((w) => w.length > 0).length}
          </span>
          <span>
            Language: {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Connected</span>
          </div>
          <span>UTF-8</span>
          <span>Ln {code.slice(0, code.length).split("\n").length}, Col 1</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
