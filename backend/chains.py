from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from config import OPENAI_API_KEY


llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o-mini-2024-07-18", max_tokens=1000)

# Query Splitting Prompt and Chaining
split_query_prompt = PromptTemplate(
    input_variables=["query"],
    template="""
    주어진 질문을 다음과 같은 형식으로 5개의 서브쿼리로 나누세요. 서브쿼리만을 반환하고, 다른 추가 메세지는 제외하세요.
    여기서 "서브쿼리"는 질문을 세부적인 부분으로 분해한 것입니다.


    예시:
    - 질문이 매우 일반적인 경우 구체적인 요구사항을 도출하려고 시도합니다.
    - 질문에 포함된 키워드를 기반으로 관련 질문을 제시합니다.

    질문: {query}
    서브쿼리:
    """
)
split_query_chain = LLMChain(llm=llm, prompt=split_query_prompt)

# Merging text created by subqueries and Chaining
merge_context_prompt = PromptTemplate(
    input_variables=["subquery_outputs"],
    template="""
    다음의 서브쿼리 출력을 하나의 문맥으로 결합하세요.
    각 서브쿼리가 어떻게 문맥에 기여하는지를 명확히 해주세요.
    예시:
    - 각 서브쿼리의 핵심 아이디어나 정보를 통합하세요.
    - 문맥을 하나로 묶을 때 유기적으로 연결되도록 합니다.
    - 만약 No good Google Search Result was found라는 서브쿼리가 있다면, 이를 문맥에 포함시키지 않습니다.

    서브쿼리 출력: {subquery_outputs}
    최종 생성된 context:
    """
)
merge_context_chain = LLMChain(llm=llm, prompt=merge_context_prompt)

# Generating a final answer using the context and the initial user query // also chaining
generate_final_answer_prompt = PromptTemplate(
    input_variables=["context", "user_query"],
    template="""
    주어진 문맥을 기반으로 사용자의 질문에 답변하세요. 
    답변은 명확하고 구체적이어야 하며, 문맥을 충분히 반영해야 합니다.
    예시:
    - 질문에 대한 답을 구체적으로 작성하며, 필요한 경우 관련 정보도 제공합니다.
    - 문맥을 기반으로, 사용자가 이해할 수 있는 방식으로 대답하세요.

    문맥: {context}
    사용자의 질문: {user_query}
    답변:
    """
)
generate_final_answer_chain = LLMChain(llm=llm, prompt=generate_final_answer_prompt)
