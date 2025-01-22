from flask import Flask, request, jsonify
from flask_cors import CORS
from main import split_query, langchain_agent, merge_context, final_answer

app = Flask(__name__)

# CORS to handle OPTIONS requests.
# Simply using app(cors) created CORS issues with the frontend.
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8080", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}}, supports_credentials=True)


@app.route('/api/split-query', methods=['POST', 'OPTIONS'])
def split_query_endpoint():
    """Step 1~3 : Splitting user prompt into subqueries."""

    # Handle OPTIONS requests for Prefilght CORS requests
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    user_prompt = data.get('prompt', '')

    if not user_prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    try:
        # Step 1: Split the query into subqueries
        subqueries, tasks = split_query(user_prompt)

        # Step 2 and Step 3: Process subqueries and gather outputs
        subquery_outputs = langchain_agent(subqueries, tasks)

        # Return tasks (subqueries) and subquery outputs
        return jsonify({
            'tasks': tasks,
            'subquery_outputs': subquery_outputs
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-final-answer', methods=['POST'])
def generate_final_answer_endpoint():
    """Step 4~5: Merge context and generate final answer."""
    data = request.json
    subquery_outputs = data.get('subquery_outputs', [])
    user_prompt = data.get('prompt', '')

    # Check if subquery outputs and prompt are provided
    if not subquery_outputs or not user_prompt:
        return jsonify({'error': 'Subquery outputs and prompt are required'}), 400

    try:
        # Step 4: Merge subquery outputs into a single context
        merged_context = merge_context(subquery_outputs)

        # Step 5: Generate the final answer
        answer = final_answer(merged_context, user_prompt)

        # Return the merged context and final answer
        # For future build, returning merged context and final answer must be separated for a streaming-like UX.
        return jsonify({
            'merged_context': merged_context,
            'final_answer': answer
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
