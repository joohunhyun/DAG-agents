from langchain.tools import tool
from langchain_google_community import GoogleSearchAPIWrapper
from chains import llm  # Reuse the LLM instance from chains.py
from config import GOOGLE_API_KEY, GOOGLE_CSE_ID

# Initialize Google Search Tool
search_tool = GoogleSearchAPIWrapper(google_api_key = GOOGLE_API_KEY, google_cse_id = GOOGLE_CSE_ID, k=5)

@tool("external_search_required")
def check_search_required(subquery: str) -> str:
    """Check if a subquery requires external search."""
    decision_prompt = f"Does the following query require external search? Respond with 'Yes' or 'No'.\nQuery: {subquery}"
    return llm(decision_prompt)

@tool("perform_external_search")
def perform_external_search(query: str) -> str:
    """Perform a Google search for the query and return the results."""
    return search_tool.run(query)
