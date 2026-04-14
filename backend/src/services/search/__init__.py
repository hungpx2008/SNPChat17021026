"""
Hybrid Search package — Semantic + BM25 + RRF fusion.

Ported from Smart2Brain's hybrid search architecture.
Combines Qdrant semantic search with Whoosh BM25 lexical search,
merged via Reciprocal Rank Fusion (RRF).
"""

from .hybrid_search import HybridSearchService
from .lexical_search import LexicalSearchService
from .query_enhancer import QueryEnhancer, EnhancedQuery, QueryStrategy
from .search_ranking import calculate_tag_boost, calculate_title_boost

__all__ = [
    "HybridSearchService",
    "LexicalSearchService",
    "QueryEnhancer",
    "EnhancedQuery",
    "QueryStrategy",
    "calculate_title_boost",
    "calculate_tag_boost",
]
