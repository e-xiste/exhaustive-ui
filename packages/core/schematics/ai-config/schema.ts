export type AiTool = 'none' | 'claude-code' | 'cursor' | 'gemini-cli' | 'open-ai-codex' | 'vscode';

export interface Schema {
    tool?: AiTool[];
}
