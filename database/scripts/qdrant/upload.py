import uuid
from typing import List
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
)
from dotenv import load_dotenv
import os

load_dotenv('../.env')

openai_client = OpenAI(api_key=os.getenv("EMBEDDING_MODEL_API_KEY"), base_url=os.getenv("EMBEDDING_MODEL_BASE_URL"))
qdrant_client = QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY"))

def read_and_split_file(file_path: str) -> List[str]:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return content.split("\n======\n")

def ensure_collection(vector_size: int, collection_name: str):
    if not qdrant_client.collection_exists(collection_name):
        qdrant_client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )

def embed_chunks(chunks: List[str]) -> List[List[float]]:
    response = openai_client.embeddings.create(
        model=os.getenv("EMBEDDING_MODEL"),
        input=chunks
    )
    return [e.embedding for e in response.data]

def upload_to_qdrant(chunks: List[str], embeddings: List[List[float]], collection_name: str):
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={"text": chunk}
        )
        for chunk, embedding in zip(chunks, embeddings)
    ]
    qdrant_client.upsert(collection_name=collection_name, points=points)

def process_file_and_upload(file_path: str, collection_name: str):
    print("Reading and splitting file...")
    chunks = read_and_split_file(file_path)

    print("Embedding chunks...")
    embeddings = embed_chunks(chunks)

    print("Ensuring Qdrant collection exists...")
    ensure_collection(len(embeddings[0]), collection_name)

    print("Uploading to Qdrant...")
    upload_to_qdrant(chunks, embeddings, collection_name)

    print("Done.")
