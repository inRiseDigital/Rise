import os


def load_prompt()->str:
    with open("prompts/prompts.md", "r", encoding="utf-8") as file:
        return file.read()
