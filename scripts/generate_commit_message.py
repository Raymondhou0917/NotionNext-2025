#!/usr/bin/env python3
import os
import subprocess
import sys
from typing import List, Optional
import openai
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

def get_git_diff() -> str:
    """獲取尚未提交的變更內容"""
    try:
        # 獲取已暫存的變更
        staged_diff = subprocess.check_output(
            ['git', 'diff', '--cached', '--stat'], 
            stderr=subprocess.STDOUT
        ).decode('utf-8')
        
        # 獲取未暫存的變更
        unstaged_diff = subprocess.check_output(
            ['git', 'diff', '--stat'],
            stderr=subprocess.STDOUT
        ).decode('utf-8')
        
        return f"Staged changes:\n{staged_diff}\nUnstaged changes:\n{unstaged_diff}"
    except subprocess.CalledProcessError as e:
        print(f"Error getting git diff: {e}")
        return ""

def generate_commit_message(diff_content: str) -> Optional[str]:
    """使用 OpenAI API 生成 commit message"""
    try:
        openai.api_key = os.getenv('OPENAI_API_KEY')
        if not openai.api_key:
            print("Error: OPENAI_API_KEY not found in environment variables")
            return None

        prompt = f"""Based on the following git diff, generate a concise and descriptive commit message following conventional commits format.
The message should be in English and follow this format: <type>(<scope>): <description>

Types can be:
- feat: new feature
- fix: bug fix
- docs: documentation only changes
- style: changes that do not affect the meaning of the code
- refactor: code change that neither fixes a bug nor adds a feature
- perf: code change that improves performance
- test: adding missing tests
- chore: changes to the build process or auxiliary tools

Git diff:
{diff_content}

Generate only the commit message without any explanation."""

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates git commit messages."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating commit message: {e}")
        return None

def main():
    # 獲取 git diff
    diff_content = get_git_diff()
    if not diff_content:
        print("No changes detected")
        sys.exit(1)

    # 生成 commit message
    commit_message = generate_commit_message(diff_content)
    if not commit_message:
        print("Failed to generate commit message")
        sys.exit(1)

    # 將 commit message 寫入到 COMMIT_EDITMSG 檔案
    commit_msg_file = sys.argv[1] if len(sys.argv) > 1 else '.git/COMMIT_EDITMSG'
    try:
        with open(commit_msg_file, 'w') as f:
            f.write(commit_message)
        print(f"Generated commit message: {commit_message}")
    except Exception as e:
        print(f"Error writing commit message: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
