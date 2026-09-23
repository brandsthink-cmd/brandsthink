'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="section"><h1>A brief interruption.</h1><p>We could not load this page. Please try again or call +91 9633033322.</p><button className="button" onClick={reset}>Try again</button></main>}
