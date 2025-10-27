from typing import Annotated
import yaml
from dotenv import load_dotenv
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage
from langchain_openai.chat_models import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from prompts import load_prompt


load_dotenv()

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)


llm = ChatOpenAI(
    model=config['llm']['model'],
    temperature=config['llm']['temperature'],
)


embeddings = OpenAIEmbeddings(model=config['embedding_model'])

tool_data = []


class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]


agent_prompt=load_prompt()

agent_name=config["agent_name"]

