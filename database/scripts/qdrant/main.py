from upload import process_file_and_upload
import os

KNOWLEDGE_COLLECTION_NAME = os.getenv("KNOWLEDGE_COLLECTION_NAME")
API_COLLECTION_NAME = os.getenv("API_COLLECTION_NAME")

if __name__ == "__main__":
    process_file_and_upload("output/documents/knowledges.md", KNOWLEDGE_COLLECTION_NAME)
    process_file_and_upload("output/documents/references.md", API_COLLECTION_NAME)