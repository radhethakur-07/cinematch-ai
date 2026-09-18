"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Copy, Check, ArrowLeft, ExternalLink, Code2, Database, Sparkles } from "lucide-react";

export default function LicensePage() {
  const [copied, setCopied] = useState(false);

  const licenseText = `MIT License

Copyright (c) 2026 CineMatch AI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  const copyLicense = () => {
    navigator.clipboard.writeText(licenseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cinema-secondary hover:text-cinema-text transition-colors group mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-soft border border-crimson/30 text-crimson shadow-subtle">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
                License & Copyright
              </h1>
              <p className="text-xs sm:text-sm text-cinema-muted mt-0.5">
                Open-source licensing terms, intellectual property disclosures, and third-party API attributions.
              </p>
            </div>
          </div>
        </div>

        {/* MIT License Card */}
        <div className="rounded-card border border-cinema-border bg-cinema-surface p-6 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cinema-border-subtle">
            <div>
              <h2 className="text-base font-semibold text-cinema-text">The MIT License (MIT)</h2>
              <p className="text-xs text-cinema-muted">Official software license for the CineMatch AI platform</p>
            </div>
            <button
              onClick={copyLicense}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-medium bg-cinema-elevated hover:bg-cinema-hover border border-cinema-border text-cinema-text transition-colors cursor-pointer w-fit shadow-subtle"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-semantic-success" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied to Clipboard" : "Copy License Text"}</span>
            </button>
          </div>

          <pre className="font-mono text-xs leading-relaxed text-cinema-secondary bg-cinema-void/60 p-4 rounded-control border border-cinema-border-subtle overflow-x-auto whitespace-pre-wrap selection:bg-crimson/20 selection:text-crimson">
            {licenseText}
          </pre>
        </div>

        {/* Third-Party Attributions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-cinema-text">Third-Party Service & Data Attributions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TMDB */}
            <div className="rounded-card border border-cinema-border bg-cinema-surface p-5 space-y-2.5 shadow-subtle">
              <div className="flex items-center gap-2 text-gold">
                <Database className="h-4 w-4" />
                <h3 className="text-sm font-semibold text-cinema-text">The Movie Database</h3>
              </div>
              <p className="text-xs text-cinema-muted leading-relaxed">
                Movie metadata, cast lists, directors, synopsis, and posters are sourced using the TMDB API.
              </p>
              <div className="pt-2">
                <span className="inline-block text-[11px] font-medium text-cinema-disabled italic">
                  Not officially certified or endorsed by TMDB.
                </span>
              </div>
            </div>

            {/* Google Gemini */}
            <div className="rounded-card border border-cinema-border bg-cinema-surface p-5 space-y-2.5 shadow-subtle">
              <div className="flex items-center gap-2 text-crimson">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-sm font-semibold text-cinema-text">Google Gemini AI</h3>
              </div>
              <p className="text-xs text-cinema-muted leading-relaxed">
                Natural language query parsing, contextual intent breakdown, and explainable semantic matching.
              </p>
              <div className="pt-2">
                <span className="inline-block text-[11px] font-medium text-cinema-disabled italic">
                  Powered by Gemini Flash 1.5 API.
                </span>
              </div>
            </div>

            {/* Scikit-Learn */}
            <div className="rounded-card border border-cinema-border bg-cinema-surface p-5 space-y-2.5 shadow-subtle">
              <div className="flex items-center gap-2 text-semantic-info">
                <Code2 className="h-4 w-4" />
                <h3 className="text-sm font-semibold text-cinema-text">Scikit-Learn ML</h3>
              </div>
              <p className="text-xs text-cinema-muted leading-relaxed">
                Hybrid recommendation engine combining TF-IDF cosine vector similarities with Truncated SVD matrix factorization.
              </p>
              <div className="pt-2">
                <span className="inline-block text-[11px] font-medium text-cinema-disabled italic">
                  BSD 3-Clause open-source license.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic and Evaluation Notice */}
        <div className="rounded-card border border-cinema-border bg-cinema-surface/50 p-5 flex items-start gap-3.5">
          <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-semibold text-cinema-text">Academic & Portfolio Project Notice</h4>
            <p className="text-cinema-muted leading-relaxed">
              CineMatch AI is developed as a collegiate capstone project demonstrating production-grade Next.js, FastAPI, and Machine Learning integration. All movie media assets, posters, and trademarks belong to their respective copyright holders and movie production studios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
