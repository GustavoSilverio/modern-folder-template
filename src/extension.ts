import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createFolderAndFiles', (folder: vscode.Uri) => {
        vscode.window.showInputBox({ prompt: 'Coloque o nome para os arquivos.' }).then((name: string | undefined) => {
            if (name && folder) {
                const folderPath = folder.fsPath;

                fs.mkdirSync(path.join(folderPath, name));

                const files = {
                    'styled.ts': `import { styled } from '@mui/material';\n\nexport const ${name} = styled()(({ theme }) => ({\n\n}))`,
                    'types.ts': `export interface ${name}Props {\n\n}\n`,
                    'tsx': `import * as Styled from './${name}.styled';\nimport { ${name}Props } from './${name}.types';\n\nexport const ${name} = ({\n\n}) => (\n    <${name}>\n        {/* O conteudo vai aqui */}\n    </${name}>\n);\n`,
                    'index.ts': `export { ${name} } from './${name}';\n`
                };

                Object.entries(files).forEach(([extension, content]) => {
                    const fileName = extension === 'index.ts' ? 'index.ts' : `${name}.${extension}`;
                    fs.writeFileSync(path.join(folderPath, extension === 'index.ts' ? '' : name, fileName), content);
                });

            }
        });
    });

    context.subscriptions.push(disposable);
}
