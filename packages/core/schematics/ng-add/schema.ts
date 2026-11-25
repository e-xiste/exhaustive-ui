import { AiTool } from '../ai-config/schema';

export type Theme = 'Aura' | 'Lara' | 'Material' | 'Nora';

export interface Schema {
    project?: string;
    theme?: Theme;
    ai?: AiTool[];
    skipInstall?: boolean;
}
