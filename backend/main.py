from chains import split_query_chain, merge_context_chain, generate_final_answer_chain
from tools import check_search_required, perform_external_search

def split_query(query: str):
    # Step 1: Split query
    result = split_query_chain.invoke(query)  # This returns a dictionary
    print(result)  # Add this to inspect the returned result
    
    subqueries = result.get('text', '').split("\n")  # Access 'text' or check for another key
    tasks = []  # Initialize tasks list to store subqueries

    return subqueries, tasks
    

def langchain_agent(subqueries: list, tasks: list):

    subquery_outputs = []

    for subquery in subqueries:
        tasks.append(f"{subquery}")  # Store subqueries as tasks
        
        # Step 2: Check if external search is required
        search_required = check_search_required(subquery).content.strip().lower()  # Extract content
        
        # Step 3: Fetch results if necessary
        if search_required == "yes":
            search_result = perform_external_search(subquery)
            subquery_outputs.append(search_result)
        else:
            subquery_outputs.append(f"다음 subquery는 외부 검색을 필요하지 않습니다: {subquery}")

    return subquery_outputs
    
def merge_context(subquery_outputs: list):
    # Step 4: Merge outputs
    merged_context = merge_context_chain.invoke({"subquery_outputs": "\n".join(subquery_outputs)})
    return merged_context

def final_answer(merged_context: str, query: str):
    # Step 5: Generate final answer
    final_answer = generate_final_answer_chain.invoke({"context": merged_context, "user_query": query})
    
    # Return both tasks (subqueries) and final answer
    return final_answer
