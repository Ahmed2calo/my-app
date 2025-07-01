import React, { useState, useEffect } from "react";

// Define the Quote type
interface Quote {
  author: string;
  quote: string;
  tags: string[];
}

function Quote() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  // Fetch quotes when component mounts
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/3-javascript/challenges/group_1/data/random-quotes.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setQuotes(data);
        // Set a random quote initially
        const random = data[Math.floor(Math.random() * data.length)];
        setCurrentQuote(random);
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
      });
  }, []);

  useEffect(() => {
  if (currentQuote && currentQuote.tags) {
    console.log("Tags:", currentQuote.tags.join(" "));
  }
}, [currentQuote]);


  // Pick a random quote
  function getNewQuote() {
    if (quotes.length === 0) return;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(random);
  }

  // Copy quote to clipboard
  function copyQuote() {
    if (currentQuote) {
      const combinedText = `"${currentQuote.quote}" — ${currentQuote.author}`;
      navigator.clipboard.writeText(combinedText);
      alert("Quote copied to clipboard!");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-xl w-full text-center">
        <p className="text-xl font-semibold mb-2">
          {currentQuote ? currentQuote.quote : "Loading quote..."}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {currentQuote ? `— ${currentQuote.author}` : "—"}
        </p>
        <p>
  {currentQuote
    ? currentQuote.tags.map((tag, index) => (
        <span key={index} className="mr-2">
          {tag}
        </span>
      ))
    : "wait the tag"}
</p>
<br></br>
        <div className="flex justify-center gap-4">
          <button
            onClick={getNewQuote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Quote
          </button>
          <button
            onClick={copyQuote}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Copy
          </button>

        
        </div>
      </div>
    </div>
  );
}

export default Quote;
