import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { configureAiTools } from '../utils/ai-tools';
import { Schema } from './schema';

/**
 * Sets up AI coding tools in a workspace that already uses ExhaustiveUI (`ng add` offers the same
 * setup in a new one): the MCP server in the tool's config file, and a section in its instructions.
 */
export function aiConfig(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        if (!(options.tool ?? []).some((tool) => tool !== 'none')) {
            context.logger.info('No AI tool selected, nothing to configure. Choose one with --tool, for example --tool=claude-code.');
            return;
        }
        configureAiTools(tree, context, options.tool);
    };
}
