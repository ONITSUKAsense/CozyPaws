from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

from app.agent.memory import get_checkpointer
from app.agent.tools import TOOLS
from app.rag.chain import build_llm


def build_agent(with_memory: bool = False):
    """LangGraph tool-calling agent over the pet store tools."""
    llm = build_llm().bind_tools(TOOLS)
    tool_node = ToolNode(TOOLS)

    def call_model(state):
        return {"messages": [llm.invoke(state["messages"])]}

    def should_continue(state):
        last = state["messages"][-1]
        if getattr(last, "tool_calls", None):
            return "tools"
        return END

    graph = StateGraph(MessagesState)
    graph.add_node("agent", call_model)
    graph.add_node("tools", tool_node)
    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    graph.add_edge("tools", "agent")

    checkpointer = get_checkpointer() if with_memory else None
    return graph.compile(checkpointer=checkpointer)
